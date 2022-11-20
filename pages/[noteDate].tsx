import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../src/redux/hooks'
import { useRouter } from 'next/router'
import { fetchNote } from '../src/redux/actions'

type Props = {}

export default function PastDate(props: Props) {
	const dispatch = useAppDispatch()
	const { allNotes } = useAppSelector((s) => s)
	const router = useRouter()
	const noteDate = router.query.noteDate as Note['id'] | undefined
	const [isLoading, setIsLoading] = useState(true)
	const [displayError, setDisplayError] = useState(false)

	useEffect(() => {
		if (typeof noteDate != 'string') {
			// await for noteDate to be retrieved from URL
		} else if (!allNotes[noteDate] && !displayError) {
			// note is not fetched
			dispatch(fetchNote({ noteId: noteDate }))
				.unwrap()
				//	1. if note exists, set isLoading as false
				.then(() => setIsLoading(false))
				//	2. if note does not exist, set displayError to true
				.catch((err) => {
					console.log({ err })

					setDisplayError(true)
				})
		} else {
			// operation completed
			setIsLoading(false)
		}
	}, [allNotes, noteDate, displayError, dispatch])

	return (
		<div>
			{isLoading
				? 'loading...'
				: displayError
				? 'There was an error'
				: noteDate}
		</div>
	)
}
