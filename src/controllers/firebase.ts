import { doc, setDoc, getDoc } from 'firebase/firestore'
import { database } from '../config/firebase.config'

const workspaceId = 'my-workspace'

export async function saveNote({ note }: { note: Note }) {
	const noteRef = doc(database, 'workspaces', workspaceId, 'notes', note.id)

	return setDoc(noteRef, note)
}

export async function fetchNote({ noteId }: { noteId: string }) {
	const noteRef = doc(database, 'workspaces', workspaceId, 'notes', noteId)
	return getDoc(noteRef).then((snapshot) => snapshot.data())
}
