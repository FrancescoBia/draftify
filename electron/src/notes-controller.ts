import { store } from './store'
import generatePushId from './utils/generatePushId'

export const saveNote: ElectronAPIHandle<'saveNote'> = async (_, { note }) => {
	// return store.set(`notes.${note.id}`, note)
	console.log(note)

	return
}

export const getNote: ElectronAPIHandle<'getNote'> = async (_, { noteId }) => {
	return store.get(`notes.${noteId}`) as Note
}

export const getAllNotes: ElectronAPIHandle<'getAllNotes'> = async (_) => {
	return (store.get(`notes`) || {}) as NoteList
}

export const deleteNote: ElectronAPIHandle<'deleteNote'> = async (
	_,
	{ noteId }
) => {
	//
	return store.delete(`notes.${noteId}` as any)
}

// ------------------------------------
// WORKSPACE

const createWorkspace = () => {
	console.log('creating a new workspace id')
	const newWorkspaceId = generatePushId('ws')
	return store.set(`workspaceId`, newWorkspaceId)
}

const getWorkspaceId = () => {
	const workspaceId = store.get('workspaceId')
	return workspaceId
}

export const checkIfWorkspaceIdIsSet = () => {
	const workspaceId = getWorkspaceId()
	if (!workspaceId) createWorkspace()
}

// -------------------------------------
// DEV only methods!

export function _deleteAllNotes() {
	if (process.env.NODE_ENV === 'development') {
		store.delete('notes')
	} else {
		console.log(
			'Error: tried calling a dev-only method while NODE_ENV is:',
			process.env.NODE_ENV
		)
	}
}
