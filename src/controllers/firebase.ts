import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore'
import { database } from '../config/firebase.config'

const workspaceId = 'my-workspace'

export async function _saveNote({ note }: { note: Note }) {
	const noteRef = doc(database, 'workspaces', workspaceId, 'notes', note.id)

	return setDoc(noteRef, note)
}

export async function _fetchNote({ noteId }: { noteId: string }) {
	const noteRef = doc(database, 'workspaces', workspaceId, 'notes', noteId)
	return getDoc(noteRef).then((snapshot) => {
		const note = snapshot.data()

		if (!note) throw new Error('note not found')
		else return note as Note
	})
}

export async function _fetchAllNotes() {
	const notesListRef = collection(database, 'workspaces', workspaceId, 'notes')
	return getDocs(notesListRef).then((snapshot) => {
		let notes: { [id: Note['id']]: Note } = {}
		snapshot.forEach((doc) => {
			const note = doc.data() as Note
			notes = { ...notes, [note.id]: note }
		})
		return notes
	})
}
