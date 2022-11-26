// import { useContext } from 'react'
// import { NotesContext } from '../../pages/_app'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getNoteIdFromDate, prettyFormatDate } from '../utils/dateFormatter'
import today_note from '../assets/images/today_note.png'
import past_notes from '../assets/images/past_notes.png'

type Props = {}

const Navigator = (props: Props) => {
	// const today = getNoteIdFromDate()
	// const allNotes = useContext(NotesContext)

	return (
		<div className='p-4 w-[104px]'>
			<div className='bg-gray-100 dark:bg-gray-900 flex flex-col p-2 rounded-xl fixed'>
				<IconButton
					href='/today'
					image={today_note}
					alt="button to today's note"
				/>
				<IconButton href='/all' image={past_notes} alt='button to past notes' />
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
			className='w-14 p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:bg-opacity-60 relative group'
		>
			{isSelected && (
				<div className='absolute bg-white w-1 h-1 rounded-full -left-[2px] top-[26px]' />
			)}
			<div className='absolute hidden group-hover:inline-block bg-gray-800 left-full ml-4 p-1 top-1/2 -translate-y-1/2 rounded border border-gray-700 px-2 whitespace-nowrap'>
				{props.href == '/today' ? "Today's note" : 'All notes'}
			</div>
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

type NoteItemProps = {
	noteId: Note['id'] | 'today'
}

const NoteItem = (props: NoteItemProps) => {
	const router = useRouter()
	const isSelected = location.pathname.split('/')[1] === props.noteId

	return (
		<button
			className={`px-6 py-2 text-left ${
				isSelected ? 'bg-gray-100 dark:bg-gray-800 font-bold' : ''
			}`}
			onClick={() => router.push(`/${props.noteId}`)}
		>
			{props.noteId === 'today' ? 'today' : prettyFormatDate(props.noteId)}
		</button>
	)
}

export { Navigator }
