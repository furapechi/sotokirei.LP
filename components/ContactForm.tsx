'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const schema = z.object({
	name: z.string().min(1, 'お名前は必須です'),
	phone: z.string().optional(),
	email: z.string().email('メール形式が不正です').optional().or(z.literal('')),
	address: z.string().optional(),
	notes: z.string().optional(),
	// honeypot
	website: z.string().max(0).optional(),
})

type FormValues = z.infer<typeof schema>

export function ContactForm({
	defaultService,
	defaultArea,
	defaultPrice,
}: {
	defaultService?: string | null
	defaultArea?: number | null
	defaultPrice?: number | null
}) {
	const [submitting, setSubmitting] = useState(false)
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: '', phone: '', email: '', address: '', notes: '' },
	})

	async function onSubmit(values: FormValues) {
		if (values.website) return // honey
		setSubmitting(true)
		try {
			const res = await fetch('/api/quote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					service_slug: defaultService,
					area_m2: defaultArea,
					inputs_json: {},
					calculated_price: defaultPrice ?? null,
					name: values.name,
					phone: values.phone,
					email: values.email,
					address: values.address,
					notes: values.notes,
					// honeypot echo
					website: values.website,
				}),
			})
			const data = await res.json().catch(() => ({}))
			if (res.ok && data?.ok !== false) {
				toast.success('送信しました。担当よりご連絡いたします。')
				form.reset()
			} else {
				toast.error('送信に失敗しました。しばらくして再度お試しください。')
			}
		} catch {
			toast.error('通信エラーが発生しました')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="w-full max-w-2xl mx-auto">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					<input type="text" name="website" className="hidden" aria-hidden="true" tabIndex={-1} />
					<div className="grid sm:grid-cols-2 gap-4">
						<FormField name="name" control={form.control} render={({ field }) => (
							<FormItem>
								<FormLabel>お名前</FormLabel>
								<FormControl>
									<Input placeholder="山田 太郎" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<FormField name="phone" control={form.control} render={({ field }) => (
							<FormItem>
								<FormLabel>電話番号</FormLabel>
								<FormControl>
									<Input inputMode="tel" placeholder="090-1234-5678" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
					</div>
					<div className="grid sm:grid-cols-2 gap-4">
						<FormField name="email" control={form.control} render={({ field }) => (
							<FormItem>
								<FormLabel>メール</FormLabel>
								<FormControl>
									<Input inputMode="email" placeholder="you@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<FormField name="address" control={form.control} render={({ field }) => (
							<FormItem>
								<FormLabel>ご住所</FormLabel>
								<FormControl>
									<Input placeholder="市区町村・番地" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
					</div>
					<FormField name="notes" control={form.control} render={({ field }) => (
						<FormItem>
							<FormLabel>ご要望・現場状況（任意）</FormLabel>
							<FormControl>
								<Textarea rows={4} placeholder="例）面積約120m²、竹あり、駐車2台可" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)} />
					<Button type="submit" size="lg" disabled={submitting} className="w-full">
						{submitting ? '送信中...' : 'この内容で問い合わせ'}
					</Button>
				</form>
			</Form>
		</div>
	)
}


