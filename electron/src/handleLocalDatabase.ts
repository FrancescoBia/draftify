import * as ElectronStore from 'electron-store'
import generatePushId from './utils/generatePushId'

type ElectronAPIHandle<Method extends keyof ElectronAPI> = (
	event: Electron.IpcMainInvokeEvent,
	...arg: Parameters<ElectronAPI[Method]>
) => ReturnType<ElectronAPI[Method]>

type MySchema = {
	notes: {
		[noteId: Note['id']]: Note
	}
}

const schema: ElectronStore.Schema<MySchema> = {
	notes: {
		type: 'object',
		additionalProperties: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				dateCreated: { type: 'string' },
				lastModified: { type: 'string' },
				content: { type: 'object' },
			},
			required: ['id', 'dateCreated', 'lastModified'],
		},
	},
}

const store = new ElectronStore({ schema })

// ------------------------------------
// NOTES

export const saveNote: ElectronAPIHandle<'saveNote'> = async (_, { note }) => {
	return store.set(`notes.${note.id}`, note)
}

export const getNote: ElectronAPIHandle<'getNote'> = async (_, { noteId }) => {
	return store.get(`notes.${noteId}`) as Note
}

export const getAllNotes: ElectronAPIHandle<'getAllNotes'> = async (_) => {
	return store.get(`notes`) as NoteList
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

export const checkIfWorkspaceIdIsSet = () => {
	const workspace = store.get('workspaceId')
	if (!workspace) createWorkspace()
}
