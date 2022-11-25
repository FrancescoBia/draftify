import { useRouter } from 'next/router'
import EditableNote from '../../src/components/EditableNote'

type EditProps = {}

export default function Edit(props: EditProps) {
	const router = useRouter()
	const noteId = router.query.noteDate as Note['id'] | undefined

	return noteId ? <EditableNote noteId={noteId!} /> : 'loading'
}
