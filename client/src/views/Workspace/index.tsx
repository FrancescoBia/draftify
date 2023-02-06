import { Route, Routes, useParams, useNavigate } from 'react-router-dom'
import EditableNote from './EditableNote'
import Navigator from './Navigator'
import NoteList from './NoteList'
import { NotesContext } from '../App'
import { useContext } from 'react'
import * as Dialog from '@radix-ui/react-alert-dialog'
import { Trash } from 'react-feather'

export default function Workspace() {
	return (
		<div className='flex grow'>
			<Navigator />
			<Routes>
				<Route path='/' element={<EditableNote noteId='2023-01-31' />} />
				<Route path='all' element={<NoteList />} />
				<Route path=':date' element={<PastEditableNote />} />
			</Routes>
		</div>
	)
}

function PastEditableNote() {
	const { date } = useParams()
	const navigate = useNavigate()
	const { setAllNotes } = useContext(NotesContext)
	const noteId = date as Note['id']

	function handleDeleteNote() {
		window.electronAPI!.deleteNote({ noteId }).then(() => {
			setAllNotes!((notes) => {
				const { [noteId]: omit, ...remainingNotes } = notes
				return remainingNotes
			})
			navigate('/all')
		})
	}

	return (
		<>
			<EditableNote noteId={date as Note['id']} />
			{window.electronAPI &&
				window.electronAPI.appVersion &&
				window.electronAPI.appVersion() > '1.0.3' && (
					<Dialog.Root>
						<Dialog.Trigger asChild>
							<button className='fixed bottom-0 right-0 m-4 flex justify-center items-center w-8 h-8 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-200 group dark:hover:bg-red-800'>
								<div className='absolute hidden group-hover:block right-full top-0 whitespace-nowrap mr-2 bg-gray-100 dark:bg-gray-900 rounded-xl px-3 py-1 text-secondary text-sm h-full'>
									Delete note
								</div>
								<Trash />
							</button>
						</Dialog.Trigger>
						<Dialog.Portal>
							<Dialog.Overlay className='dialog-overlay' />
							<Dialog.Content className='dialog-content position-middle'>
								<Dialog.Title className='text-primary text-lg'>
									Do you want to delete this note?
								</Dialog.Title>
								<Dialog.Description className='text-secondary mb-8 mt-2'>
									This action cannot be undone.
								</Dialog.Description>
								<div className='flex gap-4 justify-end'>
									<Dialog.Cancel asChild>
										<button className='button-secondary'>Go back</button>
									</Dialog.Cancel>
									<Dialog.Action asChild>
										<button
											className='button-destroy'
											onClick={handleDeleteNote}
										>
											Yes, delete note
										</button>
									</Dialog.Action>
								</div>
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
				)}
		</>
	)
}
