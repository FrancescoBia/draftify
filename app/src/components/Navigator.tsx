import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { prettyFormatDate } from '../utils/dateFormatter'
import today_note from '../assets/images/today_note.png'
import past_notes from '../assets/images/past_notes.png'
import HelpIcon from '../assets/help-circle.svg'

type Props = {}

export default function Navigator(props: Props) {
	return (
		<div className='p-4 w-[104px] shrink-0 z-10 pb-5'>
			<div className='fixed h-[calc(100vh-4rem)]'>
				<div className='bg-gray-100 dark:bg-gray-900 flex flex-col p-2 rounded-xl '>
					<IconButton
						href='/today'
						image={today_note}
						alt="button to today's note"
					/>
					<IconButton
						href='/all'
						image={past_notes}
						alt='button to past notes'
					/>
				</div>
				{location.pathname === '/all' && <SearchModal />}
				<a
					className='text-gray-400 bg-primary-int rounded-lg p-3 m-3 flex items-center group/label justify-center absolute bottom-0'
					href='https://tally.so/r/wArxyk'
				>
					<HelpIcon />
					<FloatingLabel label='Support' />
				</a>
			</div>
		</div>
	)
}

type ButtonProps = {
	href: string
	image: StaticImageData
	alt: string
}

const IconButton = (props: ButtonProps) => {
	const { pathname } = useRouter()
	const isSelected = pathname == props.href

	return (
		<Link
			href={props.href}
			className='w-14 p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:bg-opacity-60 relative group/label'
		>
			{isSelected && (
				<div className='absolute dark:bg-white bg-gray-900 w-1 h-1 rounded-full -left-[2px] top-[26px]' />
			)}
			<FloatingLabel
				label={props.href == '/today' ? "Today's note" : 'All notes'}
			/>

			{props.href == '/today' ? (
				<p className='absolute z-10 top-6 left-3 w-8 text-center leading-none bg-white text-gray-900'>
					{new Date().getDate()}
				</p>
			) : (
				// <p className='absolute z-10 top-4 left-3 text-center leading-none bg-white text-gray-900 make-iso'>
				// 	{new Date().getDate() - 1}
				// </p>
				<></>
			)}
			<Image
				src={props.image}
				alt={props.alt}
				className='drop-shadow-icon'
				priority
			/>
		</Link>
	)
}

// NB! Parent must have the 'group/label' class in order to use the hover effect
const FloatingLabel = (props: { label: string }) => {
	return (
		<div className='absolute hidden group-hover/label:inline-block dark:bg-gray-800 bg-gray-100 left-full ml-4 p-1 top-1/2 -translate-y-1/2 rounded border dark:border-gray-700 border-gray-200 px-2 whitespace-nowrap text-primary'>
			{props.label}
		</div>
	)
}

// -------------------------------------------------------
// SEARCH MODAL
// -------------------------------------------------------

import { useContext, useEffect, useState } from 'react'
import { NotesContext } from '../../pages/_app'
import SearchIcon from '../assets/search.svg'
import * as Dialog from '@radix-ui/react-alert-dialog'

const SearchModal = () => {
	const { allNotes } = useContext(NotesContext)
	const [cleanNotesArray, setCleanNotesArray] = useState<Note[]>()
	const [searchTerm, setSearchTerm] = useState('')
	const [openModal, setOpenModal] = useState(false)

	useEffect(() => {
		//
		allNotes &&
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
	}, [allNotes])

	return (
		<>
			<Dialog.Root onOpenChange={setOpenModal} open={openModal}>
				<button
					className='text-gray-400 bg-primary-int rounded-lg relative p-3 m-3 flex items-center group/label justify-center'
					onClick={() => setOpenModal(true)}
				>
					<SearchIcon />
					<FloatingLabel label='Search' />
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
											/>
										)
									})}
							</div>
						)}
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
		<>
			{props.content && props.content.includes(props.searchParam) ? (
				<Link href={`/${props.noteId}/edit`} className='relative z-10'>
					<div className='px-4 py-3 bg-secondary-int text-left w-full'>
						<h4 className='text-sm font-semibold mb-1'>
							{prettyFormatDate(props.noteId)}
						</h4>
						<div className='text-xs line-clamp-3'>{props.content}</div>
					</div>
				</Link>
			) : (
				<></>
			)}
		</>
	)
}
