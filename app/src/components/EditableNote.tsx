import { useState, useEffect, useContext } from 'react'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('./Editor'), {
	ssr: false,
})
import { useDebouncedCallback } from 'use-debounce'
import { getNoteIdFromDate, getFormattedDate } from '../utils/dateFormatter'
import { SerializedEditorState } from 'lexical'
import { NotesContext } from '../../pages/_app'

type NoteProps = {
	noteId: Note['id']
}

export default function EditableNote({ noteId }: NoteProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [displayError, setDisplayError] = useState(false)
	// progressSaved currently not displayed, but useful to keep for eventual later use
	const [progressSaved, setProgressSaved] = useState(true)
	const [initialNoteState, setInitialNoteState] = useState<Note>()
	const { setAllNotes } = useContext(NotesContext)

	async function saveData(jsonData: SerializedEditorState) {
		// makes sure that the note is loaded
		if (!initialNoteState) throw new Error('Tried saving empty note')

		const updatedNote: Note = { ...initialNoteState, content: jsonData }
		return window
			.electronAPI!.saveNote({
				note: updatedNote,
			})
			.then(() => {
				console.log('data saved')
				// save the updated note back to the main context
				setAllNotes &&
					setAllNotes((allNotes) => {
						return { ...allNotes, [updatedNote.id]: updatedNote }
					})
				setProgressSaved(true)
			})
	}

	const debounceSaveData = useDebouncedCallback(saveData, 1000, {
		maxWait: 10000,
	})

	function handleEditorContentChange(jsonData: SerializedEditorState) {
		if (!initialNoteState) return
		setProgressSaved(false)
		debounceSaveData(jsonData)
	}

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

		// IMPORTANT! This calls the function right away in case the component unmounts (e.g. the user leaves the page)
		return () => debounceSaveData.flush()
	}, [noteId, debounceSaveData])

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
