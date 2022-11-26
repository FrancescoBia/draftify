import { useRouter } from 'next/router'
import EditableNote from '../../src/components/EditableNote'

type Props = {}

export default function EditPage(props: Props) {
	const { query } = useRouter()

	return <EditableNote noteId={query.noteId as Note['id']} />
}
