import { useContext } from 'react'
import { NotesContext } from './_app'
import Editor from '../src/components/Editor'
import { prettyFormatDate, getNoteIdFromDate } from '../src/utils/dateFormatter'
import Link from 'next/link'

interface AllNotesProps {}

export default function AllNotes(props: AllNotesProps) {
	const { allNotes } = useContext(NotesContext)

	return (
		<>
			{/* <SearchModal /> */}
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

import * as Dialog from '@radix-ui/react-alert-dialog'
const SearchModal = () => {
	return (
		<>
			<Dialog.Root defaultOpen={true}>
				<Dialog.Trigger asChild>
					<button className='fixed bottom-0 right-0 m-4 flex justify-center items-center w-8 h-8 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-200 group dark:hover:bg-red-800'>
						<div className='absolute hidden group-hover:block right-full top-0 whitespace-nowrap mr-2 bg-gray-100 dark:bg-gray-900 rounded-xl px-3 py-1 text-secondary text-sm h-full'>
							Delete note
						</div>
					</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className='dialog-overlay' />
					<Dialog.Content className='dialog-content flex flex-col p-2'>
						<fieldset className='Fieldset mb-2'>
							<input className='Input py-3' id='search' placeholder='Search' />
						</fieldset>
						<div className='overflow-y-scroll bg-secondary rounded'>
							<SearchResult noteId='2022-11-01' content='' searchParam='for' />
							<SearchResult noteId='2022-11-01' content='' searchParam='for' />
							<SearchResult noteId='2022-11-01' content='' searchParam='for' />
							<SearchResult noteId='2022-11-01' content='' searchParam='for' />
							<SearchResult noteId='2022-11-01' content='' searchParam='for' />
							<SearchResult noteId='2022-11-01' content='' searchParam='for' />
							<SearchResult noteId='2022-11-01' content='' searchParam='for' />
							<SearchResult noteId='2022-11-01' content='' searchParam='for' />
							<SearchResult noteId='2022-11-01' content='' searchParam='for' />
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	)
}

const SearchResult = (props: {
	noteId: Note['id']
	content: string
	searchParam: string
}) => {
	return (
		<button className='px-4 py-3 bg-secondary-int text-left'>
			<h4 className='text-sm font-semibold mb-1'>
				{prettyFormatDate(props.noteId)}
			</h4>
			<div className='text-xs'>
				first of all, I think the value proposition is not compelling enough.
				What should makes people wanting to buy this? I think I need a better
				framework to define the user problem. Or maybe I need to do validation
				before building anything.
			</div>
		</button>
	)
}
