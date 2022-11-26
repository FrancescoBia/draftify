import { useContext } from 'react'
import { NotesContext } from './_app'
import Editor from '../src/components/Editor'
import { prettyFormatDate } from '../src/utils/dateFormatter'
import Link from 'next/link'

interface AllNotesProps {}

export default function AllNotes(props: AllNotesProps) {
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
				<div className='grow overflow-y-scroll divide-y mr-4 mb-12'>
					{(Object.keys(allNotes) as Note['id'][])
						.sort()
						.reverse()
						.map((noteId) => {
							return (
								<div
									className='p-4 py-8 max-w-4xl mx-auto flex gap-x-6 gap-y-3 md:flex-row flex-col justify-between group'
									key={'key-' + noteId}
								>
									<div className='text-gray-400 mt-1 shrink-0 font-semibold flex md:flex-col flex-row gap-y-2 md:items-start justify-between md:justify-start'>
										<p>{prettyFormatDate(noteId)}</p>
										<Link
											href={`/${noteId}/edit`}
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
											initialText={JSON.stringify(allNotes[noteId].content)}
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
