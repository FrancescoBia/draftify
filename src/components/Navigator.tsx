import { useRouter } from 'next/router'
import { getNoteIdFromDate, prettyFormatDate } from '../utils/dateFormatter'

type Props = {
	notesIdList: Array<Note['id']>
}

const Navigator = (props: Props) => {
	const today = getNoteIdFromDate()

	return (
		<div className='h-full w-12 bg-gray-100 dark:bg-gray-900 group'>
			<div className='absolute z-10 top-0 left-0 w-56 bg-white dark:bg-gray-900 h-screen shadow-lg hidden group-hover:block opacity-0 hover:opacity-100 transition-opacity duration-500 pt-4'>
				<div className='flex flex-col'>
					{props.notesIdList.map((noteId) => (
						<NoteItem
							key={'note-item-' + noteId}
							noteId={noteId === today ? 'today' : noteId}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

type NoteItemProps = {
	noteId: Note['id'] | 'today'
}

const NoteItem = (props: NoteItemProps) => {
	const router = useRouter()
	const isSelected = location.pathname.split('/')[1] === props.noteId

	return (
		<button
			className={`px-6 py-2 text-left ${
				isSelected ? 'bg-gray-100 dark:bg-gray-800 font-bold' : ''
			}`}
			onClick={() => router.push(`/${props.noteId}`)}
		>
			{props.noteId === 'today' ? 'today' : prettyFormatDate(props.noteId)}
		</button>
	)
}

export { Navigator }
