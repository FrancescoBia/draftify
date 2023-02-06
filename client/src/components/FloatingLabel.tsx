/**
 * NB! Parent must have the 'group/label' class in order to use the hover effect
 */
const FloatingLabel = (props: { label: string }) => {
	return (
		<div className='absolute hidden group-hover/label:inline-block dark:bg-gray-800 bg-gray-100 left-full ml-4 p-1 top-1/2 -translate-y-1/2 rounded border dark:border-gray-700 border-gray-200 px-2 whitespace-nowrap text-primary'>
			{props.label}
		</div>
	)
}

export default FloatingLabel
