import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('./Editor'), {
	ssr: false,
})
import { useDebouncedCallback } from 'use-debounce'
import {
	prettyFormatDate,
	getNoteIdFromDate,
	getFormattedDate,
} from '../utils/dateFormatter'
import { useRouter } from 'next/router'
import Lock from '../assets/Lock.svg'
import {
	SerializedEditorState,
	SerializedElementNode,
	SerializedLexicalNode,
} from 'lexical'

type NoteProps = {
	noteId: Note['id']
}

export default function EditableNote({ noteId }: NoteProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const [displayError, setDisplayError] = useState(false)
	const [progressSaved, setProgressSaved] = useState(true)
	const [initialNoteState, setInitialNoteState] = useState<Note>()

	useEffect(() => {
		window
			.electronAPI!.getNote({ noteId })
			.then((note) => {
				// load the note
				if (note) setInitialNoteState(note)
				// create a new note with the given Id
				// TODO! This is not great as it might override a note not correctly fetched
				else {
					console.log('creating new note')
					const currentTimestamp = getFormattedDate()
					const newNote: Note = {
						id: getNoteIdFromDate(),
						lastModified: currentTimestamp,
						dateCreated: currentTimestamp,
						content: undefined,
					}
					setInitialNoteState(newNote)
				}
				setIsLoading(false)
			})
			.catch((err) => {
				setDisplayError(true)
				throw new Error(err)
			})
	}, [noteId])

	async function saveData(jsonData: SerializedEditorState) {
		// makes sure that the note is loaded
		if (!initialNoteState) throw new Error('Tried saving empty note')

		return window
			.electronAPI!.saveNote({
				note: { ...initialNoteState, content: jsonData },
			})
			.then(() => {
				console.log('data saved')
				setProgressSaved(true)
			})
	}
	const debounceSaveData = useDebouncedCallback(saveData, 1000)

	function handleEditorContentChange(jsonData: SerializedEditorState) {
		if (!initialNoteState) return
		setProgressSaved(false)
		debounceSaveData(jsonData)
	}

	return (
		<div className='grow flex h-full overflow-y-scroll justify-center'>
			{isLoading ? (
				'Loading'
			) : displayError || !initialNoteState ? (
				'error'
			) : (
				<div className='max-w-2xl grow flex flex-col'>
					{/* <div className='p-4 flex justify-between items-center'>
						<p className='text-gray-500'>{prettyFormatDate(noteId)}</p>
						<div className='flex items-center gap-6'>
							<p className='text-gray-500'>
								{progressSaved ? '✔︎ saved' : 'saving...'}
							</p>
							<button
								onClick={() => router.push(`/${noteId}`)}
								type='button'
								className='text-gray-900 flex gap-2 items-center bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 fill-gray-900 dark:fill-white'
							>
								<Lock />
								<p className=''>Lock</p>
							</button>
						</div>
					</div> */}
					<div className='grow p-4'>
						<Editor
							key={`${noteId}-editor`}
							onChange={handleEditorContentChange}
							initialText={JSON.stringify(initialNoteState.content)}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
