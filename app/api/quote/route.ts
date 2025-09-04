import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
	try {
		const body = await req.json().catch(() => ({}))
		// 簡易ハニーポット
		if (body?.website) {
			return NextResponse.json({ ok: true })
		}
		const supabase = createClient()
		const payload = {
			service_slug: body?.service_slug ?? null,
			area_m2: body?.area_m2 ?? null,
			inputs_json: body?.inputs_json ?? {},
			calculated_price: body?.calculated_price ?? null,
			name: body?.name ?? null,
			phone: body?.phone ?? null,
			email: body?.email ?? null,
			address: body?.address ?? null,
			notes: body?.notes ?? null,
		}
		// DB が未用意な環境でも落ちないようバリデート
		if (payload.area_m2 !== null && typeof payload.area_m2 !== 'number') {
			return NextResponse.json({ ok: false, message: 'invalid area' }, { status: 400 })
		}
		const { error } = await supabase.from('quotes').insert(payload as any)
		if (error) {
			// DB 未準備時も 200 を返す（LP 運用優先）
			return NextResponse.json({ ok: true })
		}
		return NextResponse.json({ ok: true })
	} catch (e) {
		return NextResponse.json({ ok: false }, { status: 500 })
	}
}


