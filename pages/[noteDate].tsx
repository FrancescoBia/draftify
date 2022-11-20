import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../src/redux/hooks'
import { useRouter } from 'next/router'
import { fetchNote } from '../src/redux/actions'
import Editor from '../src/components/Editor'

type Props = {}

export default function PastDate(props: Props) {
	const dispatch = useAppDispatch()
	const { allNotes } = useAppSelector((s) => s)
	const router = useRouter()
	const noteDate = router.query.noteDate as Note['id'] | undefined
	const [isLoading, setIsLoading] = useState(true)
	const [displayError, setDisplayError] = useState(false)

	useEffect(() => {
		if (typeof noteDate != 'string') {
			// await for noteDate to be retrieved from URL
		} else if (!allNotes[noteDate] && !displayError) {
			// note is not fetched
			dispatch(fetchNote({ noteId: noteDate }))
				.unwrap()
				//	1. if note exists, set isLoading as false
				.then(() => setIsLoading(false))
				//	2. if note does not exist, set displayError to true
				.catch((err) => {
					console.log({ err })

					setDisplayError(true)
				})
		} else {
			// operation completed
			setIsLoading(false)
		}
	}, [allNotes, noteDate, displayError, dispatch])

	return (
		<div className='grow flex h-full overflow-y-scroll justify-center'>
			{isLoading ? (
				'Loading...'
			) : displayError ? (
				'Note not found'
			) : (
				<RenderNote note={allNotes[noteDate!]} />
			)}
		</div>
	)
}

type NoteProps = {
	note: Note
}
function RenderNote({ note }: NoteProps) {
	return (
		<div className='max-w-2xl grow'>
			<div className='p-4 flex justify-between items-center'>
				<p className='text-gray-500'>{note.id}</p>
				<button
					onClick={() => {}}
					type='button'
					className='text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
				>
					Edit Note
				</button>
			</div>
			<div className='grow p-4 pb-20'>
				<Editor setText={() => {}} initialText={JSON.stringify(note.content)} />
			</div>
		</div>
	)
}
