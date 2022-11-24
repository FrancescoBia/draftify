import { useContext } from 'react'
import { NotesContext } from './_app'

interface AllNotesProps {}

export default function AllNotes(props: AllNotesProps) {
	const allNotes = useContext(NotesContext)
	console.log('reading cotext', { allNotes })

	return (
		<div>
			{!allNotes
				? 'loading'
				: Object.values(allNotes).length < 1
				? 'no notes found'
				: Object.values(allNotes)[0].id}
		</div>
	)
}
