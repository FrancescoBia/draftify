import { useContext } from 'react'
import Note from '../src/components/EditableNote'
import { NotesContext } from './_app'
import Editor from '../src/components/Editor'

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
				<div className='grow flex h-full overflow-y-scroll justify-center'>
					<div className='max-w-2xl grow flex flex-col'>
						{(Object.keys(allNotes) as Note['id'][])
							.sort()
							.reverse()
							.map((noteId) => {
								return (
									<div className='p-4' key={'key-' + noteId}>
										<Editor
											editable={false}
											onChange={() => {}}
											key={'key-' + noteId}
											initialText={JSON.stringify(allNotes[noteId].content)}
										/>
									</div>
								)
							})}
					</div>
				</div>
			)}
		</>
	)
}
