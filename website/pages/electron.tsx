import { useEffect } from 'react'

export default function Electron() {
	return (
		<div className='w-full h-screen flex flex-col'>
			{/* Electron draggable title bar */}
			<div className='webkit-app-drag h-7 w-full shrink-0' />
			{/* Rest of the page */}
			<div className='grow flex justify-center items-center'>
				<div className='max-w-md text-center'>
					<p className='font-semibold'>
						Draftify needs to be updated to the new version
					</p>
					<p className='text-sm my-4'>
						The app should update automatically. If not, try restart it and wait
						a couple of minutes, or manually download the new version.
					</p>
					<a className='text-secondary' href=''>
						Contact support
					</a>
				</div>
			</div>
		</div>
	)
}
