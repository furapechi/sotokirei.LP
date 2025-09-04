import { notFound } from 'next/navigation'
import { BeforeAfter } from '@/components/BeforeAfter'

const WORKS = [
	{
		slug: 'sample-park-lawn',
		title: '公園の芝刈り',
		before: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
		after: 'https://images.unsplash.com/photo-1457410129867-5999af49daf7?q=80&w=1600&auto=format&fit=crop',
		body: '広い芝生の一斉刈り。安全第一で周辺清掃まで対応しました。',
	},
	{
		slug: 'sample-pruning',
		title: '庭木の剪定',
		before: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=1600&auto=format&fit=crop',
		after: 'https://images.unsplash.com/photo-1464692805480-a69dfaafdb0d?q=80&w=1600&auto=format&fit=crop',
		body: '伸びた枝を整え、日当たりと風通しを改善。景観が大きく向上しました。',
	},
]

export default function WorkDetail({ params }: { params: { slug: string } }) {
	const work = WORKS.find((w) => w.slug === params.slug)
	if (!work) return notFound()
	return (
		<div className="py-10 space-y-6">
			<h1 className="text-2xl font-bold">{work.title}</h1>
			<BeforeAfter beforeUrl={work.before} afterUrl={work.after} alt={work.title} />
			<p className="text-slate-700">{work.body}</p>
		</div>
	)
}


