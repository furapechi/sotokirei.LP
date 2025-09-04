import Image from 'next/image'
import Link from 'next/link'

const WORKS = [
	{
		slug: 'sample-park-lawn',
		title: '公園の芝刈り',
		before: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
		after: 'https://images.unsplash.com/photo-1457410129867-5999af49daf7?q=80&w=1600&auto=format&fit=crop',
	},
	{
		slug: 'sample-pruning',
		title: '庭木の剪定',
		before: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=1600&auto=format&fit=crop',
		after: 'https://images.unsplash.com/photo-1464692805480-a69dfaafdb0d?q=80&w=1600&auto=format&fit=crop',
	},
]

export default function WorksPage() {
	return (
		<div className="py-10 space-y-6">
			<h1 className="text-3xl font-bold">実績</h1>
			<div className="grid sm:grid-cols-2 gap-6">
				{WORKS.map((w) => (
					<Link key={w.slug} href={`/works/${w.slug}`} className="group rounded-xl overflow-hidden border bg-white">
						<div className="relative aspect-[16/10]">
							<Image src={w.after} alt={w.title} fill className="object-cover transition-transform group-hover:scale-[1.02]" />
						</div>
						<div className="p-4 font-semibold">{w.title}</div>
					</Link>
				))}
			</div>
		</div>
	)
}


