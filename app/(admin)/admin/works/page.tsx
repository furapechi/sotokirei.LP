'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ImageUploader } from '@/components/ImageUploader'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type Item = { slug: string; title: string; before: string; after: string }

const KEY = 'works-admin-drafts'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function WorksAdminPage() {
	const [items, setItems] = useState<Item[]>([
		{ slug: 'sample-park-lawn', title: '公園の芝刈り', before: '', after: '' },
		{ slug: 'sample-pruning', title: '庭木の剪定', before: '', after: '' },
	])
	const supabase = createClient()

	useEffect(() => {
		const saved = localStorage.getItem(KEY)
		if (saved) setItems(JSON.parse(saved))
		;(async () => {
			try {
				const { data } = await supabase.from('works').select('slug,title,before_images,after_images').limit(20)
				if (data && data.length) {
					setItems(
						data.map((w: any) => ({
							slug: w.slug ?? 'no-slug',
							title: w.title ?? '無題',
							before: (w.before_images?.[0] as string) || '',
							after: (w.after_images?.[0] as string) || '',
						}))
					)
				}
			} catch {}
		})()
	}, [])

	useEffect(() => {
		localStorage.setItem(KEY, JSON.stringify(items))
	}, [items])

	return (
		<div className="py-8 space-y-6">
			<h1 className="text-2xl font-bold">実績（画像アップロード・入替）</h1>
			<div className="grid gap-6">
				{items.map((it, idx) => (
					<Card key={it.slug} className="p-4 grid gap-4">
						<div className="font-semibold">{it.title}</div>
						<div className="grid sm:grid-cols-2 gap-4">
							<ImageUploader label="Before" value={it.before} onChange={(url) => update(idx, { before: url ?? '' })} />
							<ImageUploader label="After" value={it.after} onChange={(url) => update(idx, { after: url ?? '' })} />
						</div>
						<div className="flex gap-3">
							<Button variant="outline" onClick={() => swap(idx)}>入れ替え</Button>
							<Button onClick={() => save(idx)}>保存</Button>
						</div>
					</Card>
				))}
			</div>
		</div>
	)

	function update(index: number, patch: Partial<Item>) {
		setItems((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)))
	}

	function swap(index: number) {
		setItems((prev) => prev.map((v, i) => (i === index ? { ...v, before: v.after, after: v.before } : v)))
	}

	async function save(index: number) {
		const it = items[index]
		try {
			const { error } = await supabase
				.from('works')
				.upsert({
					slug: it.slug,
					title: it.title,
					before_images: it.before ? [it.before] : [],
					after_images: it.after ? [it.after] : [],
				})
			if (error) throw error
			toast.success('保存しました')
			localStorage.setItem(KEY, JSON.stringify(items))
		} catch {
			toast.error('保存に失敗しました（権限/RLSをご確認ください）')
		}
	}
}


