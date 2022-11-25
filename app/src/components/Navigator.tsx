// import { useContext } from 'react'
// import { NotesContext } from '../../pages/_app'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getNoteIdFromDate, prettyFormatDate } from '../utils/dateFormatter'
import today_icon from '../assets/images/today_icon.png'
import past_notes from '../assets/images/past-notes.png'

type Props = {}

const Navigator = (props: Props) => {
	// const today = getNoteIdFromDate()
	// const allNotes = useContext(NotesContext)

	return (
		<div className='p-4 w-[104px]'>
			<div className='bg-gray-100 dark:bg-gray-900 flex flex-col p-2 rounded-xl fixed'>
				<IconButton
					href='/today'
					image={today_icon}
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
	return (
		<Link
			href={props.href}
			className='w-14 p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:bg-opacity-60'
		>
			<Image src={props.image} alt={props.alt} className='drop-shadow-icon' />
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
