import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('../src/components/Editor'), {
	ssr: false,
})

import { useAppSelector, useAppDispatch } from '../src/redux/hooks'

import { _saveNote } from '../src/controllers/firebase'
import { Navigator } from '../src/components/Navigator'
import { fetchNote } from '../src/redux/note-slice'

export default function Home() {
	const dispatch = useAppDispatch()
	const note = useAppSelector((s) => s.note)
	const [text, setText] = useState('')

	function saveText() {
		const today = new Date().toISOString()
		const dateKey = today.substring(0, 10)

		const myNote: Note = {
			id: dateKey,
			dateCreated: 'today',
			lastModified: 'today',
			content: text,
		}
		_saveNote({ note: myNote }).then(() => {
			console.log('note saved')
		})
	}

	useEffect(() => {
		const today = new Date().toISOString()
		const dateKey = today.substring(0, 10)

		dispatch(fetchNote({ noteId: dateKey })).unwrap()
	}, [dispatch])

	return (
		<>
			<Head>
				<title>Journal</title>
				<meta name='description' content='My journal app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='h-screen flex'>
				<Navigator />
				<div className='grow flex flex-col h-full overflow-y-scroll'>
					<div className='max-w-2xl mx-auto mb-20'>
						<div className='p-4 flex justify-between items-center'>
							<p className='text-gray-500'>18th November</p>
							<button
								onClick={saveText}
								type='button'
								className='text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
							>
								Save
							</button>
						</div>
						<div className='grow p-4'>
							{note && (
								<Editor
									setText={setText}
									initialText={note.content}
									placeholder='What you are you thinking?'
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
