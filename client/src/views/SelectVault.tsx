import Logo from '../assets/images/logo.png'

export default function SelectVault() {
	return (
		<div className='flex flex-col items-center justify-center grow bg-secondary text-center'>
			<div className='w-24 my-4'>
				<img src={Logo} alt='draftify logo' className='drop-shadow-icon' />
			</div>
			<div className='p-4 rounded-xl max-w-sm'>
				<h2 className='text-secondary text-sm'>
					Select a vault location for your documents:
				</h2>
				<button
					className='p-4 rounded-lg bg-tertiary-int my-4 w-full text-left'
					onClick={() => {
						window.electronAPI!.createVault().then((path) => {
							console.log({ path })
						})
					}}
				>
					<h3 className='font-semibold'>Create a new vault</h3>
					<p className='text-secondary text-sm'>
						Create a new Draftify vault in a folder
					</p>
				</button>
				<button
					className='p-4 rounded-lg bg-tertiary-int w-full text-left'
					onClick={() => {
						window.electronAPI!.selectExistingVault().then((path) => {
							console.log({ path })
						})
					}}
				>
					<h3 className='font-semibold'>Open an existing vault</h3>
					<p className='text-secondary text-sm'>
						Choose an existing Draftify vault in a folder
					</p>
				</button>
			</div>
			<a
				href='https://tally.so/r/wArxyk'
				className='text-sm text-tertiary hover:text-gray-700 font-medium'
			>
				Support
			</a>
		</div>
	)
}
