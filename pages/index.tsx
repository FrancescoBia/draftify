import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('../src/components/Editor'), {
	ssr: false,
})

import { fetchNote, saveNote } from '../src/controllers/firebase'

const initialText =
	'{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Lorem ipsum dolorem sit amet","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"This text should be in bold","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":2,"mode":"normal","style":"","text":"This should be in italic","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'

export default function Home() {
	const [text, setText] = useState('')

	function saveText() {
		const myNote: Note = {
			id: 'my-new-note',
			dateCreated: 'today',
			lastModified: 'today',
			content: text,
		}
		saveNote({ note: myNote }).then(() => {
			console.log('note saved')
		})
	}

	useEffect(() => {
		fetchNote({ noteId: 'my-new-note' }).then((note) => setText(note?.content))
	}, [])

	return (
		<>
			<Head>
				<title>Journal</title>
				<meta name='description' content='My journal app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='h-screen'>
				<div className='flex flex-col h-full max-w-2xl mx-auto'>
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
						<Editor setText={setText} initialText={text} />
					</div>
				</div>
			</div>
		</>
	)
}
