import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
	makeNoteEditable,
	cleanupEditableNote,
	saveNote,
} from '../redux/editableNote-slice'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('./Editor'), {
	ssr: false,
})

type NoteProps = {
	noteId: Note['id']
}
export default function EditableNote({ noteId }: NoteProps) {
	const dispatch = useAppDispatch()
	const { editableNote: note } = useAppSelector((s) => s)
	const [noteContent, setNoteContent] = useState('{}')
	const [isLoading, setIsLoading] = useState(true)
	const [displayError, setDisplayError] = useState(false)

	useEffect(() => {
		dispatch(makeNoteEditable(noteId))
			.unwrap()
			.then((note) => {
				setNoteContent(JSON.stringify(note.content))
				setIsLoading(false)
			})
			.catch(() => setDisplayError(true))

		return () => {
			dispatch(cleanupEditableNote())
		}
	}, [noteId, dispatch])

	function handleSaveNote() {
		const myNote: Note = {
			...note!,
			content: JSON.parse(noteContent),
		}
		dispatch(saveNote({ updatedNote: myNote }))
	}

	return (
		<div className='grow flex h-full overflow-y-scroll justify-center'>
			{isLoading ? (
				'Loading'
			) : displayError || !note ? (
				'error'
			) : (
				<div className='max-w-2xl grow'>
					<div className='p-4 flex justify-between items-center'>
						<p className='text-gray-500'>{note!.id}</p>
						<button
							onClick={handleSaveNote}
							type='button'
							className='text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
						>
							Save
						</button>
					</div>
					<div className='grow p-4 pb-20'>
						<Editor
							namespace={note.id}
							setText={setNoteContent}
							initialText={JSON.stringify(note.content)}
							placeholder='What you are you thinking?'
						/>
					</div>
				</div>
			)}
		</div>
	)
}
