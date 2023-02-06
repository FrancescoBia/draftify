import Editor from './Editor'
import { useParams } from 'react-router-dom'
import { getNoteIdFromDate } from '../../../utils/dateFormatter'

export default function EditableNote() {
	const params = useParams()
	const noteId: Note['id'] = (params.date as Note['id']) || getNoteIdFromDate()

	return <Editor noteId={noteId} key={noteId} />
}
