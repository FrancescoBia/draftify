import { useState } from 'react'
import { _saveNote } from '../src/controllers/firebase'
import { getNoteIdFromDate } from '../src/utils/dateFormatter'
import EditableNote from '../src/components/EditableNote'

type Props = {}

export default function Today(props: Props) {
	const [today] = useState(getNoteIdFromDate())

	return (
		<>
			{window?.electronAPI ? (
				<div className='webkit-app-drag fixed h-7 w-full' />
			) : (
				<></>
			)}
			<EditableNote noteId={today} />
		</>
	)
}
