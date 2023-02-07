/**
 * NB! Parent must have the 'group/label' class in order to use the hover effect
 */
const FloatingLabel = (props: { label: string; keyShortcut?: string }) => {
	return (
		<div className='absolute hidden group-hover/label:inline-block dark:bg-gray-800 bg-gray-100 left-full ml-4 p-1 top-1/2 -translate-y-1/2 rounded border dark:border-gray-700 border-gray-200 px-2 whitespace-nowrap text-primary'>
			{props.label}
			{props.keyShortcut && (
				<span className='text-sm ml-2 px-1 py-0.5 bg-gray-500 bg-opacity-10 rounded text-secondary'>
					{props.keyShortcut}
				</span>
			)}
		</div>
	)
}

export default FloatingLabel
