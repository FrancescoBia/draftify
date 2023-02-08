import Image from 'next/image'
import Logo from '../assets/images/logo.png'

export default function Footer() {
	return (
		<footer className='p-4 bg-white sm:p-6 dark:bg-gray-800'>
			<div className='mx-auto max-w-screen-xl'>
				<div className='md:flex md:justify-between'>
					<div className='mb-6 md:mb-0'>
						<a href='https://draftify.app' className='flex items-center'>
							<Image
								src={Logo}
								alt='Draftify Logo'
								className='w-14 mr-3 shadow-md'
							/>
							<span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
								Draftify
							</span>
						</a>
					</div>
					<div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
						<div>
							<h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white'>
								Resources
							</h2>
							<ul className='text-gray-600 dark:text-gray-400 list-none'>
								<li className='mb-4'>
									<a
										href='https://github.com/FrancescoBia/draftify'
										target='_blank'
										className='hover:underline '
									>
										Github
									</a>
								</li>
								<li>
									<a
										href='https://twitter.com/frabia__'
										target='_blank'
										className='hover:underline'
									>
										Twitter
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white'>
								Legal
							</h2>
							<ul className='text-gray-600 dark:text-gray-400 list-none'>
								<li className='mb-4'>
									<a href='#' className='hover:underline'>
										Privacy Policy
									</a>
								</li>
								<li>
									<a href='#' className='hover:underline'>
										Terms &amp; Conditions
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<hr className='my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8' />
				<div className='sm:flex sm:items-center sm:justify-between'>
					<span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
						© 2023 Draftify
					</span>
				</div>
			</div>
		</footer>
	)
}
