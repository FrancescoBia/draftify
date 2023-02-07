import { useState } from 'react'
export default function MarkdownLegend() {
	const [showMarkdownLegend, setShowMarkdownLegend] = useState(false)

	return (
		<div className='absolute right-0 m-4 flex items-end flex-col z-10'>
			<button
				className='w-8 h-8 rounded-xl p-0.5 text-center aspect-square dark:text-gray-500 border dark:border-gray-700'
				onClick={() => setShowMarkdownLegend((s) => !s)}
			>
				Aa
			</button>
			{showMarkdownLegend && (
				<div className='dark:bg-gray-900 bg-gray-100 p-4 mt-4 rounded-xl'>
					<div className='mb-2 text-lg'>Markdown guide</div>
					<div className='flex flex-col items-start gap-2'>
						<LegendItem label='# Headline 1' />
						<LegendItem label='## Headline 2' />
						<LegendItem label='### Headline 2' />
						<LegendItem label='**bold text**' />
						<LegendItem label='*italic text*' />
						<LegendItem label='> blockquote' />
						<LegendItem label='- bullet list' />
						<LegendItem label='1. numbered list' />
						<LegendItem label='-[] checklist' />
						<LegendItem label='-[x] checklist' />
						<LegendItem label='`code`' />
						<LegendItem label='``` codeblock' />
					</div>
				</div>
			)}
		</div>
	)
}

const LegendItem = (props: { label: string }) => {
	return (
		<div className='font-mono text-gray-500 dark:bg-gray-800 bg-gray-200  px-2 py-1 rounded text-sm'>
			{props.label}
		</div>
	)
}
