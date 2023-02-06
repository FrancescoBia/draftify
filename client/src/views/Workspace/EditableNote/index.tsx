import { useParams } from 'react-router-dom'
import Editor from './Editor'
import { getNoteIdFromDate } from '../../../utils/dateFormatter'
import MarkdownLegend from './MarkdownLegend'
import DeleteNoteButton from './DeleteNoteButton'

export default function EditableNote() {
	const params = useParams()
	const today = getNoteIdFromDate()
	const noteId: Note['id'] = (params.date as Note['id']) || today

	return (
		<div className='grow flex h-full overflow-y-scroll justify-center'>
			<div className='max-w-2xl grow flex flex-col'>
				<MarkdownLegend />
				<div className='grow p-4'>
					<Editor noteId={noteId} key={noteId} />
				</div>
			</div>
			{noteId !== today && <DeleteNoteButton noteId={noteId} />}
		</div>
	)
}
