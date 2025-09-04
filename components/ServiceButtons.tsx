'use client'

import { Button } from '@/components/ui/button'

const SERVICES = [
	{ slug: 'kusakari', label: '草刈' },
	{ slug: 'kusamushiri', label: '草むしり(手作業)' },
	{ slug: 'bassai', label: '伐採' },
	{ slug: 'sentei', label: '剪定' },
]

export function ServiceButtons({ onSelect }: { onSelect: (slug: string) => void }) {
	return (
		<div className="grid grid-cols-2 gap-3 w-full max-w-xl">
			{SERVICES.map((s) => (
				<Button key={s.slug} onClick={() => onSelect(s.slug)} size="lg" className="h-16 text-xl">
					{s.label}
				</Button>
			))}
		</div>
	)
}


