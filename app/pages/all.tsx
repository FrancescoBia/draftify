import { useContext } from 'react'
import { NotesContext } from './_app'

interface AllNotesProps {}

export default function AllNotes(props: AllNotesProps) {
	const allNotes = useContext(NotesContext)

	return (
		<>
			{!allNotes ? (
				'loading'
			) : Object.values(allNotes).length < 1 ? (
				<div className='h-full w-full flex items-center justify-center text-gray-500'>
					You don&apos;t have any older notes... Yet!
				</div>
			) : (
				Object.values(allNotes)[0].id
			)}
		</>
	)
}
