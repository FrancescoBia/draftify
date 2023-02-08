import { useContext } from 'react'
import { useRouter } from 'next/router'
import { NotesContext } from '../_app'
import EditableNote from '../../src/components/EditableNote'
import TrashIcon from '../../src/assets/trash-icon.svg'
import * as Dialog from '@radix-ui/react-alert-dialog'

type Props = {}

export default function EditPage(props: Props) {
	const { setAllNotes } = useContext(NotesContext)
	const router = useRouter()
	const noteId = router.query.noteId as Note['id']

	function handleDeleteNote() {
		window.electronAPI!.deleteNote({ noteId }).then(() => {
			setAllNotes!((notes) => {
				const { [noteId]: omit, ...remainingNotes } = notes
				return remainingNotes
			})
			router.push('/all')
		})
	}

	return (
		<div className='grow'>
			<div className='max-w-2xl mx-auto h-full'>
				<EditableNote noteId={noteId} />
			</div>
			{window.electronAPI &&
				window.electronAPI.appVersion &&
				window.electronAPI.appVersion() > '1.0.3' && (
					<Dialog.Root>
						<Dialog.Trigger asChild>
							<button className='fixed bottom-0 right-0 m-4 flex justify-center items-center w-8 h-8 bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-200 group dark:hover:bg-red-800'>
								<div className='absolute hidden group-hover:block right-full top-0 whitespace-nowrap mr-2 bg-gray-100 dark:bg-gray-900 rounded-xl px-3 py-1 text-secondary text-sm h-full'>
									Delete note
								</div>
								<TrashIcon />
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
		</div>
	)
}