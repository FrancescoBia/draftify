import { useState } from 'react'
import { _saveNote } from '../src/controllers/firebase'
import { getNoteIdFromDate } from '../src/utils/dateFormatter'
import EditableNote from '../src/components/EditableNote'

export default function Today() {
	const [today] = useState(getNoteIdFromDate())

	return <EditableNote noteId={today} />
}
