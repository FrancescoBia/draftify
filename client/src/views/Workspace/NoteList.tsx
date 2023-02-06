import { useContext } from 'react'
import { NotesContext } from '../App'
import Editor from '../../components/Editor'
import {
	prettyFormatDate,
	getNoteIdFromDate,
} from '../../../src/utils/dateFormatter'
import { Link } from 'react-router-dom'

interface AllNotesProps {}

export default function NoteList(props: AllNotesProps) {
	const { allNotes } = useContext(NotesContext)

	return (
		<>
			{!allNotes ? (
				'loading'
			) : Object.values(allNotes).length < 1 ? (
				<div className='h-full w-full flex items-center justify-center text-gray-500'>
					You don&apos;t have any older notes... Yet!
				</div>
			) : (
				<div className='grow overflow-y-scroll divide-y dark:divide-gray-800 mr-4 mb-12'>
					{(Object.keys(allNotes) as Note['id'][])
						// remove today's note from view
						.filter((noteId) => noteId !== getNoteIdFromDate())
						.sort()
						.reverse()
						.map((noteId) => {
							return (
								<div
									className='p-4 py-8 max-w-4xl mx-auto flex gap-x-6 gap-y-3 md:flex-row flex-col justify-between group'
									key={'key-' + noteId}
								>
									<div className='text-gray-400 mt-1 shrink-0 font-semibold flex md:flex-col flex-row gap-y-2 items-center md:items-start justify-between md:justify-start'>
										<p>{prettyFormatDate(noteId)}</p>
										<Link
											to={`/${noteId}/edit`}
											className='button-secondary  opacity-0 group-hover:opacity-100 transition-all'
										>
											Edit
										</Link>
									</div>
									<div className='max-w-2xl grow'>
										<Editor
											editable={false}
											onChange={() => {}}
											key={'key-' + noteId}
											initialText={allNotes[noteId].content}
										/>
									</div>
								</div>
							)
						})}
				</div>
			)}
		</>
	)
}
