'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

function extractStoragePathFromPublicUrl(url: string): string | null {
	try {
		const u = new URL(url)
		const idx = u.pathname.indexOf('/storage/v1/object/public/')
		if (idx === -1) return null
		const rest = u.pathname.slice(idx + '/storage/v1/object/public/'.length)
		return rest // e.g. media/folder/file.jpg
	} catch {
		return null
	}
}

export function ImageUploader({
	value,
	onChange,
	folder = 'works',
	label,
}: {
	value?: string | null
	onChange: (url: string | null) => void
	folder?: string
	label?: string
}) {
	const supabase = createClient()
	const fileRef = useRef<HTMLInputElement | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		const ext = file.name.split('.').pop() || 'dat'
		const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
		setLoading(true)
		try {
			const { error } = await supabase.storage
				.from('media')
				.upload(fileName, file, { cacheControl: '3600', upsert: true, contentType: file.type })
			if (error) {
				toast.error('アップロードに失敗しました')
				return
			}
			const { data } = supabase.storage.from('media').getPublicUrl(fileName)
			onChange(data.publicUrl)
			toast.success('アップロードしました')
		} catch {
			toast.error('アップロードでエラーが発生しました')
		} finally {
			setLoading(false)
			if (fileRef.current) fileRef.current.value = ''
		}
	}

	async function handleDelete() {
		if (!value) return
		const storagePath = extractStoragePathFromPublicUrl(value)
		if (!storagePath) {
			onChange(null)
			return
		}
		setLoading(true)
		try {
			// storagePath = media/xxx
			const pathWithoutBucket = storagePath.replace(/^media\//, '')
			const { error } = await supabase.storage.from('media').remove([pathWithoutBucket])
			if (error) {
				// パスが不明でもUI上は消せるようにする
				onChange(null)
				toast.success('削除しました（参照のみ解除）')
				return
			}
			onChange(null)
			toast.success('削除しました')
		} catch {
			onChange(null)
			toast.error('削除中にエラーが発生しました')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="grid gap-2">
			{label && <div className="text-sm font-medium">{label}</div>}
			<div className="flex items-center gap-3">
				<input ref={fileRef} type="file" accept="image/*" onChange={handleSelectFile} className="max-w-xs" />
				<Button type="button" variant="outline" size="sm" onClick={handleDelete} disabled={!value || loading}>
					削除
				</Button>
			</div>
			{value && (
				<div className="relative h-40 w-full overflow-hidden rounded-md border bg-white">
					<Image src={value} alt="preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
				</div>
			)}
		</div>
	)
}


