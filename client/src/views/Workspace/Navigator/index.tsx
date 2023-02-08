import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import today_note from '../../../assets/images/today_note.png'
import past_notes from '../../../assets/images/past_notes.png'
import FloatingLabel from '../../../components/FloatingLabel'
import SearchModal from './SearchModal'
import { HelpCircle } from 'react-feather'
import internalUrls from '../../../../../shared/lib/internal-urls'

type Props = {}

export default function Navigator(props: Props) {
	const navigate = useNavigate()

	useEffect(() => {
		function listenForKeyEvent(event: KeyboardEvent) {
			if (event.metaKey && event.code === 'Digit1') {
				event.preventDefault()
				navigate('/')
			}

			if (event.metaKey && event.code === 'Digit2') {
				event.preventDefault()
				navigate('/all')
			}
		}

		document.addEventListener('keydown', listenForKeyEvent)

		return () => {
			document.removeEventListener('keydown', listenForKeyEvent)
		}
	}, [navigate])

	return (
		<div className='p-4 w-[104px] shrink-0 z-10 pb-5'>
			<div className='fixed h-[calc(100vh-4rem)]'>
				<div className='bg-gray-100 dark:bg-gray-900 flex flex-col p-2 rounded-xl '>
					<IconButton
						href='/'
						image={today_note}
						alt="button to today's note"
					/>
					<IconButton
						href='/all'
						image={past_notes}
						alt='button to past notes'
					/>
				</div>
				<SearchModal />
				<a
					className='text-gray-400 bg-primary-int rounded-lg p-3 m-3 flex items-center group/label justify-center absolute bottom-0'
					href={internalUrls.support.ref}
				>
					<HelpCircle />
					<FloatingLabel label='Support' />
				</a>
			</div>
		</div>
	)
}

type ButtonProps = {
	href: string
	image: string
	alt: string
}

const IconButton = (props: ButtonProps) => {
	const { pathname } = useLocation()
	const isSelected = pathname === props.href

	return (
		<Link
			to={props.href}
			className='w-14 p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:bg-opacity-60 relative group/label'
		>
			{isSelected && (
				<div className='absolute dark:bg-white bg-gray-900 w-1 h-1 rounded-full -left-[2px] top-[26px]' />
			)}
			<FloatingLabel
				label={props.href === '/' ? "Today's note" : 'All notes'}
				keyShortcut={props.href === '/' ? '⌘+1' : '⌘+2'}
			/>

			{props.href === '/' ? (
				<p className='absolute z-10 top-6 left-3 w-8 text-center leading-none bg-white text-gray-900'>
					{new Date().getDate()}
				</p>
			) : (
				<></>
			)}
			<img src={props.image} alt={props.alt} className='drop-shadow-icon' />
		</Link>
	)
}
