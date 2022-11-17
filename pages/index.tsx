import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('../src/components/Editor'), {
	ssr: false,
})

export default function Home() {
	const [text, setText] = useState('')

	function saveText() {
		console.log(text)
	}

	return (
		<>
			<Head>
				<title>Journal</title>
				<meta name='description' content='My journal app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='h-screen flex flex-col'>
				<div className='p-4'>
					<button
						onClick={saveText}
						type='button'
						className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
					>
						Save
					</button>
				</div>
				<div className='grow p-6'>
					<Editor setText={setText} />
				</div>
			</div>
		</>
	)
}
