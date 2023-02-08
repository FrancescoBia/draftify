import { useContext, useEffect, useState } from 'react'
import { NotesContext } from '../../App'
import { Search } from 'react-feather'
import * as Dialog from '@radix-ui/react-alert-dialog'
import FloatingLabel from '../../../components/FloatingLabel'
import { useNavigate } from 'react-router-dom'
import { prettyFormatDate } from '../../../utils/dateFormatter'

export default function SearchModal() {
	const { allNotes } = useContext(NotesContext)
	const [cleanNotesArray, setCleanNotesArray] = useState<Note[]>()
	const [searchTerm, setSearchTerm] = useState('')
	const [openModal, setOpenModal] = useState(false)

	useEffect(() => {
		function listenForKeyEvent(event: KeyboardEvent) {
			if (event.metaKey && event.code === 'KeyF') {
				event.preventDefault()
				setOpenModal((v) => !v)
			}
		}

		document.addEventListener('keydown', listenForKeyEvent)

		return () => {
			document.removeEventListener('keydown', listenForKeyEvent)
		}
	}, [])

	useEffect(() => {
		if (allNotes) {
			setCleanNotesArray(() => {
				return Object.keys(allNotes)
					.map((noteId) => {
						const note = allNotes[noteId as Note['id']]

						const cleanupContent = (note.content || '')
							.replaceAll('`', '')
							.replaceAll('#', '')
							.replaceAll('*', '')

						return { ...note, content: cleanupContent }
					})
					.sort()
					.reverse()
			})
		}
	}, [allNotes])

	return (
		<Dialog.Root onOpenChange={setOpenModal} open={openModal}>
			<button
				className='text-gray-400 bg-primary-int rounded-lg relative p-3 m-3 flex items-center group/label justify-center'
				onClick={() => setOpenModal(true)}
			>
				<Search />
				<FloatingLabel label='Search' keyShortcut='⌘+F' />
			</button>
			<Dialog.Portal>
				<Dialog.Overlay
					className='dialog-overlay'
					onClick={() => {
						setOpenModal(false)
					}}
				/>
				<Dialog.Content className='dialog-content position-top flex flex-col p-2'>
					<fieldset className='Fieldset'>
						<input
							autoFocus={true}
							className='Input py-3'
							id='search'
							placeholder='Search'
							value={searchTerm}
							onChange={({ target }) => setSearchTerm(target.value)}
						/>
					</fieldset>
					{searchTerm === '' ? (
						<></>
					) : (
						<div className='overflow-y-scroll bg-secondary rounded mt-2 min-h-[4rem] relative'>
							<p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-tertiary text-sm z-0'>
								No notes found
							</p>
							{cleanNotesArray &&
								cleanNotesArray.map((note) => {
									return (
										<SearchResult
											noteId={note.id}
											key={'key' + note.id}
											content={note.content || ''}
											searchParam={searchTerm}
											closeModal={() => setOpenModal(false)}
										/>
									)
								})}
						</div>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

const SearchResult = (props: {
	noteId: Note['id']
	content: string
	searchParam: string
	closeModal: () => void
}) => {
	const navigate = useNavigate()

	function handleLinkClick() {
		navigate(`/${props.noteId}`)
		props.closeModal()
	}

	return props.content && props.content.includes(props.searchParam) ? (
		<button
			onClick={handleLinkClick}
			className='relative z-10 w-full bg-secondary-int px-4 py-3 text-left focus-within:outline-0'
		>
			<h4 className='text-sm font-semibold mb-1'>
				{prettyFormatDate(props.noteId)}
			</h4>
			<div className='text-xs line-clamp-3'>{props.content}</div>
		</button>
	) : (
		<></>
	)
}
