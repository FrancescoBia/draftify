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

	const [showMarkdownLegend, setShowMarkdownLegend] = useState(false)

	return (
		<div className='grow flex h-full overflow-y-scroll justify-center'>
			{isLoading ? (
				'Loading'
			) : displayError || !initialNoteState ? (
				'error'
			) : (
				<div className='max-w-2xl grow flex flex-col'>
					<div className='absolute right-0 m-4 flex items-end flex-col z-10'>
						<button
							className='w-8 h-8 rounded-xl p-0.5 text-center aspect-square dark:text-gray-500 border dark:border-gray-700'
							onClick={() => setShowMarkdownLegend((s) => !s)}
						>
							Aa
						</button>
						{showMarkdownLegend && (
							<div className='dark:bg-gray-900 bg-gray-100 p-4 mt-4 rounded-xl'>
								<div className='mb-2 text-lg'>Markdown guide</div>
								<div className='flex flex-col items-start gap-2'>
									<LegendItem label='# Headline 1' />
									<LegendItem label='## Headline 2' />
									<LegendItem label='### Headline 2' />
									<LegendItem label='**bold text**' />
									<LegendItem label='*italic text*' />
									<LegendItem label='> blockquote' />
									<LegendItem label='- bullet list' />
									<LegendItem label='1. numbered list' />
									<LegendItem label='-[] checklist' />
									<LegendItem label='-[x] checklist' />
									<LegendItem label='`code`' />
									<LegendItem label='``` codeblock' />
								</div>
							</div>
						)}
					</div>
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

const LegendItem = (props: { label: string }) => {
	return (
		<div className='font-mono text-gray-500 dark:bg-gray-800 bg-gray-200  px-2 py-1 rounded text-sm'>
			{props.label}
		</div>
	)
}
