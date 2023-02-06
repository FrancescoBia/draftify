import { useState, useEffect, useContext } from 'react'
import LexicalEditor from '../../../components/LexicalEditor'
import { useDebouncedCallback } from 'use-debounce'
import {
	getNoteIdFromDate,
	getFormattedDate,
} from '../../../utils/dateFormatter'
import { NotesContext } from '../../App'

type NoteProps = {
	noteId: Note['id']
	/** The component key is necessary to make sure that a new instance
	 * of the component is created when the note id changes */
	key: Note['id']
}

export default function Editor({ noteId }: NoteProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [displayError, setDisplayError] = useState(false)
	// progressSaved currently not displayed, but useful to keep for eventual later use
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [progressIsSaved, setProgressSaved] = useState(true)
	const [initialNoteState, setInitialNoteState] = useState<Note>()
	const { setAllNotes } = useContext(NotesContext)

	async function saveData(markdownData: string) {
		// makes sure that the note is loaded
		if (!initialNoteState) throw new Error('Tried saving empty note')

		const updatedNote: Note = { ...initialNoteState, content: markdownData }
		return window.electronAPI
			.saveNote({
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

	function handleEditorContentChange(markdownData: string) {
		if (!initialNoteState) return
		setProgressSaved(false)
		debounceSaveData(markdownData)
	}

	useEffect(() => {
		window.electronAPI
			.getNote({ noteId })
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

	return isLoading ? (
		<></>
	) : displayError || !initialNoteState ? (
		<>An Error Occurred</>
	) : (
		<LexicalEditor
			key={`${noteId}-editor`}
			onChange={handleEditorContentChange}
			initialText={initialNoteState.content}
		/>
	)
}
