'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

export function BeforeAfter({
	beforeUrl,
	afterUrl,
	alt = 'Before and After',
}: {
	beforeUrl: string
	afterUrl: string
	alt?: string
}) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [pos, setPos] = useState(50) // %

	function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
		e.currentTarget.setPointerCapture?.(e.pointerId)
		updatePosition(e)
	}

	function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
		if (e.pressure === 0 && e.buttons === 0) return
		updatePosition(e)
	}

	function updatePosition(e: React.PointerEvent<HTMLDivElement>) {
		const rect = containerRef.current?.getBoundingClientRect()
		if (!rect) return
		const x = e.clientX - rect.left
		const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
		setPos(percent)
	}

	return (
		<div
			ref={containerRef}
			className="relative w-full overflow-hidden rounded-xl border bg-white shadow-sm touch-none select-none"
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			style={{ aspectRatio: '16/10' }}
		>
			<Image src={beforeUrl} alt={alt + ' before'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
			<div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
				<Image src={afterUrl} alt={alt + ' after'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
			</div>
			<div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
				<div className="h-full w-0.5 bg-white/80 shadow-[0_0_0_1px_rgba(0,0,0,.08)]" />
				<div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white shadow ring-1 ring-black/10" />
			</div>
			<div className="pointer-events-none select-none absolute left-3 top-3 text-xs font-semibold px-2 py-1 rounded bg-white/85">Before</div>
			<div className="pointer-events-none select-none absolute right-3 top-3 text-xs font-semibold px-2 py-1 rounded bg-white/85">After</div>
		</div>
	)
}


