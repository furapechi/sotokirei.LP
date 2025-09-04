'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ImageUploader } from '@/components/ImageUploader'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type Item = { slug: string; title: string; before: string; after: string }
type WorksRow = { slug: string | null; title: string | null; before_images: string[] | null; after_images: string[] | null }

export default function WorksAdminClient() {
	const [items, setItems] = useState<Item[]>([
		{ slug: 'sample-park-lawn', title: '公園の芝刈り', before: '', after: '' },
		{ slug: 'sample-pruning', title: '庭木の剪定', before: '', after: '' },
	])
	const supabase = useMemo(() => {
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL
		const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		if (!url || !key) return null
		return createClient()
	}, [])

	useEffect(() => {
		const KEY = 'works-admin-drafts'
		const saved = localStorage.getItem(KEY)
		if (saved) setItems(JSON.parse(saved))
		if (!supabase) {
			console.warn('Supabase 環境変数が未設定のため、管理画面の読み込みをスキップします。')
			return
		}
		;(async () => {
			try {
				const { data } = await supabase.from('works').select('slug,title,before_images,after_images').limit(20)
				if (data && data.length) {
					setItems(
						(data as WorksRow[]).map((w) => ({
							slug: w.slug ?? 'no-slug',
							title: w.title ?? '無題',
							before: (w.before_images?.[0] ?? '') as string,
							after: (w.after_images?.[0] ?? '') as string,
						}))
					)
				}
			} catch {}
		})()
	}, [supabase])

	useEffect(() => {
		const KEY = 'works-admin-drafts'
		localStorage.setItem(KEY, JSON.stringify(items))
	}, [items])

	return (
		<div className="py-8 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">実績（画像アップロード・入替）</h1>
				<Link href="/" className="text-sm font-semibold underline">LPへ</Link>
			</div>
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
			if (!supabase) {
				toast.error('Supabase 環境変数が未設定のため保存できません')
				return
			}
			const { error } = await supabase
				.from('works')
				.upsert({
					slug: it.slug,
					title: it.title,
					before_images: it.before ? [it.before] : [],
					after_images: it.after ? [it.after] : [],
					status: 'published',
				})
			if (error) throw error
			toast.success('保存しました')
		} catch {
			toast.error('保存に失敗しました（権限/RLSをご確認ください）')
		}
	}
}


