import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('../src/components/Editor'), {
	ssr: false,
})

import { useAppSelector, useAppDispatch } from '../src/redux/hooks'

import { _saveNote } from '../src/controllers/firebase'
import { Navigator } from '../src/components/Navigator'
import { fetchAllNotes } from '../src/redux/actions'

/* 
TODO
- add loading state
- 
*/

export default function Home() {
	const router = useRouter()

	const { editableNote, allNotes } = useAppSelector((s) => s)
	const [text, setText] = useState('')
	const today = new Date().toISOString()
	const dateKey = today.substring(0, 10)

	function saveText() {
		const myNote: Note = {
			id: dateKey,
			dateCreated: 'today',
			lastModified: 'today',
			content: JSON.parse(text),
		}
		_saveNote({ note: myNote }).then(() => {
			console.log('note saved')
		})
	}

	useEffect(() => {
		router.push('/today')
	}, [router])

	return (
		<>
			<div className='h-screen flex'>
				<Navigator notesIdList={Object.keys(allNotes).sort().reverse()} />
				<div className='grow flex h-full overflow-y-scroll justify-center'>
					<div className='max-w-2xl grow'>
						<div className='p-4 flex justify-between items-center'>
							<p className='text-gray-500'>{editableNote?.id || dateKey}</p>
							<button
								onClick={saveText}
								type='button'
								className='text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
							>
								Save
							</button>
						</div>
						<div className='grow p-4 pb-20'>
							<Editor
								setText={setText}
								initialText={JSON.stringify(editableNote?.content)}
								placeholder='What you are you thinking?'
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
