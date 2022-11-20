import { useAppDispatch, useAppSelector } from '../src/redux/hooks'
import { useRouter } from 'next/router'

type Props = {}

export default function PastDate(props: Props) {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const { noteDate } = router.query

	return <div>{noteDate}</div>
}
