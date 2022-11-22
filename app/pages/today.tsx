import { useState } from 'react'
import { _saveNote } from '../src/controllers/firebase'
import { getNoteIdFromDate } from '../src/utils/dateFormatter'
import EditableNote from '../src/components/EditableNote'

type Props = {}

export default function Today(props: Props) {
	const [today] = useState(getNoteIdFromDate())

	return <EditableNote noteId={today} />
}
