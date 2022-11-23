import * as ElectronStore from 'electron-store'
import generatePushId from '../../../shared/utils/generatePushId'

type ElectronAPIHandle<Method extends keyof ElectronAPI> = (
	event: Electron.IpcMainInvokeEvent,
	...arg: Parameters<ElectronAPI[Method]>
) => ReturnType<ElectronAPI[Method]>

type MySchema = {
	notes: {
		[noteId: Note['id']]: Note
	}
	workspaceId: string
	lastBackup: string
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
	workspaceId: {
		type: 'string',
	},
	lastBackup: {
		type: 'string',
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

const getWorkspaceId = () => {
	const workspaceId = store.get('workspaceId')
	return workspaceId
}

export const checkIfWorkspaceIdIsSet = () => {
	const workspaceId = getWorkspaceId()
	if (!workspaceId) createWorkspace()
}

// -------------------------------------
// BACKUP

const backupNotes = () => {
	const lastBackup = store.get('lastBackup')
	if (lastBackup < '') {
	}
}