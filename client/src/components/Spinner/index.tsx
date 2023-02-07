import './index.css'

const Spinner = ({ size = '2rem' }) => {
	const style = {
		width: size,
		height: size,
	}
	return (
		<div style={style}>
			<div className='spinner dark:border-[rgba(255,255,255,0.25)] dark:border-t-white' />
		</div>
	)
}

export default Spinner
