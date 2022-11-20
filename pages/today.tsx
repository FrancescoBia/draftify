import { useState } from 'react'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('../src/components/Editor'), {
	ssr: false,
})
import { useAppSelector } from '../src/redux/hooks'
import { _saveNote } from '../src/controllers/firebase'
import { getNoteIdFromDate } from '../src/utils/dateFormatter'

type Props = {}

export default function Today(props: Props) {
	const [noteId] = useState(getNoteIdFromDate())

	return <EditableNote noteId={noteId} />
}

type EditableNoteProps = {
	noteId: string
}
function EditableNote(props: EditableNoteProps) {
	const { editableNote } = useAppSelector((s) => s)
	const [noteContent, setNoteContent] = useState(editableNote?.content)

	if (!editableNote) return <>note is loading</>

	function saveNote() {
		const myNote: Note = {
			...editableNote!,
			content: JSON.parse(noteContent),
		}
		_saveNote({ note: myNote }).then(() => {
			console.log('note saved')
		})
	}

	return (
		<div className='grow flex h-full overflow-y-scroll justify-center'>
			<div className='max-w-2xl grow'>
				<div className='p-4 flex justify-between items-center'>
					<p className='text-gray-500'>{editableNote.id}</p>
					<button
						onClick={saveNote}
						type='button'
						className='text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
					>
						Save
					</button>
				</div>
				<div className='grow p-4 pb-20'>
					<Editor
						setText={setNoteContent}
						initialText={JSON.stringify(noteContent)}
						placeholder='What you are you thinking?'
					/>
				</div>
			</div>
		</div>
	)
}
