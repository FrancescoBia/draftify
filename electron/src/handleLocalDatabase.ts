import { dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import ElectronStore from 'electron-store'
import generatePushId from './utils/generatePushId'

type ElectronAPIHandle<Method extends keyof ElectronAPI> = (
	event: Electron.IpcMainInvokeEvent,
	...arg: Parameters<ElectronAPI[Method]>
) => ReturnType<ElectronAPI[Method]>

type MySchema = {
	notes: {
		[noteId: Note['id']]: Note
	}
	workspaceId: string
	vault: {
		path: string
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
	workspaceId: {
		type: 'string',
	},
	vault: {
		type: 'object',
		properties: {
			path: { type: 'string' },
		},
	},
}

const store = new ElectronStore({ schema })

// ------------------------------------
// NOTES

export const saveNote: ElectronAPIHandle<'saveNote'> = async (_, { note }) => {
	createDraftifyFolderPath()
	return store.set(`notes.${note.id}`, note)
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

async function createDraftifyFolderPath() {
	return dialog
		.showSaveDialog({
			title: 'Select the location to use for the Draftify file vault',
			defaultPath: '*/Draftify Vault',
			buttonLabel: 'Create Folder',
			properties: ['createDirectory'],
		})
		.then((file) => {
			// Stating whether dialog operation was cancelled or not.
			if (!file.canceled) {
				console.log(file.filePath.toString())

				return store.set('vault.path', file.filePath.toString())
			} else return
		})
		.catch((err) => {
			console.log(err)
		})
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
