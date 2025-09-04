'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ImageUploader } from '@/components/ImageUploader'

type Item = { slug: string; title: string; before: string; after: string }

const KEY = 'works-admin-drafts'

export default function WorksAdminPage() {
	const [items, setItems] = useState<Item[]>([
		{ slug: 'sample-park-lawn', title: '公園の芝刈り', before: '', after: '' },
		{ slug: 'sample-pruning', title: '庭木の剪定', before: '', after: '' },
	])

	useEffect(() => {
		const saved = localStorage.getItem(KEY)
		if (saved) setItems(JSON.parse(saved))
	}, [])

	useEffect(() => {
		localStorage.setItem(KEY, JSON.stringify(items))
	}, [items])

	return (
		<div className="py-8 space-y-6">
			<h1 className="text-2xl font-bold">実績（画像URLの登録・入替）</h1>
			<div className="grid gap-6">
				{items.map((it, idx) => (
					<Card key={it.slug} className="p-4 grid gap-4">
						<div className="font-semibold">{it.title}</div>
						<div className="grid sm:grid-cols-2 gap-4">
							<ImageUploader label="Before" value={it.before} onChange={(url) => update(idx, { before: url ?? '' })} />
							<ImageUploader label="After" value={it.after} onChange={(url) => update(idx, { after: url ?? '' })} />
						</div>
						<div>
							<Button variant="outline" onClick={() => swap(idx)}>Before/After 入れ替え</Button>
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
}


