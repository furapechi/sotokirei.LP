'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { evalPrice } from '@/lib/pricing/eval'

type Props = {
	serviceSlug: string | null
}

export function QuoteModal({ serviceSlug }: Props) {
	const [area, setArea] = useState<string>('')
	const [price, setPrice] = useState<number | null>(null)

	const handleCalc = () => {
		if (!serviceSlug) {
			toast.error('サービスを選択してください')
			return
		}
		const areaNum = Number(area)
		if (!Number.isFinite(areaNum) || areaNum <= 0) {
			toast.error('面積(m²)を正しく入力してください')
			return
		}
		// 仮の式（後で Supabase から取得）
		// expr-eval は round(x) 形式をサポート（round(x, n) は未対応）
		const expression = 'max(min_fee, round(area_m2 * base_per_m2))'
		const next = evalPrice(expression, {
			area_m2: areaNum,
			base_per_m2: 180,
			min_fee: 8000,
		})
		setPrice(next)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="lg" className="h-12">見積りする</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>概算見積（{serviceSlug ?? '未選択'}）</DialogTitle>
				</DialogHeader>
				<div className="space-y-3">
					<div className="grid gap-2">
						<Label htmlFor="area">面積 (m²)</Label>
						<Input id="area" inputMode="numeric" placeholder="例: 120" value={area} onChange={(e) => setArea(e.target.value)} />
					</div>
					<Button onClick={handleCalc} className="w-full">料金計算</Button>
					{price !== null && (
						<div className="text-xl font-bold text-center">概算: {price.toLocaleString()} 円</div>
					)}
				</div>
			</DialogContent>
			<Toaster />
		</Dialog>
	)
}


