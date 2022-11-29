import { useContext } from 'react'
import { useRouter } from 'next/router'
import { NotesContext } from '../_app'
import EditableNote from '../../src/components/EditableNote'
import TrashIcon from '../../src/assets/trash-icon.svg'

type Props = {}

export default function EditPage(props: Props) {
	const { setAllNotes } = useContext(NotesContext)
	const router = useRouter()
	const noteId = router.query.noteId as Note['id']

	return (
		<div className='grow'>
			<div className='max-w-2xl mx-auto h-full'>
				<EditableNote noteId={noteId} />
			</div>
			{window.electronAPI && window.electronAPI.appVersion() > '1.0.3' && (
				<button
					className='fixed bottom-0 right-0 m-4 flex justify-center items-center w-8 h-8 bg-red-100 text-red-500 rounded-xl border border-red-200 hover:bg-red-200 group'
					onClick={() => {
						window.electronAPI!.deleteNote({ noteId }).then(() => {
							setAllNotes!((notes) => {
								const { [noteId]: omit, ...remainingNotes } = notes
								return remainingNotes
							})
							router.push('/all')
						})
					}}
				>
					<div className='absolute hidden group-hover:block right-full top-0 whitespace-nowrap mr-2 bg-gray-100 rounded-xl px-3 py-1 text-gray-600 text-sm h-full'>
						Delete note
					</div>
					<TrashIcon />
				</button>
			)}
		</div>
	)
}
