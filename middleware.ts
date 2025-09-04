import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl
	// 正規化: 連続スラッシュを1つに潰す（例: //admin/works → /admin/works）
	if (pathname.includes('//')) {
		const normalized = pathname.replace(/\/+?/g, '/').replace(/^\/+/, '/')
		if (normalized !== pathname) {
			const url = req.nextUrl.clone()
			url.pathname = normalized
			return NextResponse.redirect(url, 308)
		}
	}
	return NextResponse.next()
}


