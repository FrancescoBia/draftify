import { store } from './store'
import generatePushId from './utils/generatePushId'
import { checkIfVaultIsSet } from './vault-controller'
import { writeFile, readFile, statSync, readdir, rm } from 'fs'
import { getFormattedDate } from './utils/dateFormatter'

let vaultPath: string
function getVaultPath() {
	if (!vaultPath) {
		vaultPath = checkIfVaultIsSet()
		if (!vaultPath) throw new Error('Vault path is not set')
	}
	return vaultPath
}

export const saveNote: ElectronAPIHandle<'saveNote'> = async (_, { note }) => {
	return writeFile(`${getVaultPath()}/${note.id}.md`, note.content, (err) => {
		if (err) throw err
	})
}

export const getNote: ElectronAPIHandle<'getNote'> = async (_, { noteId }) =>
	_getNote(noteId)

function _getNote(noteId: Note['id']) {
	const notePath = `${getVaultPath()}/${noteId}.md`
	return new Promise<Note>((resolve, reject) => {
		readFile(notePath, (err, data) => {
			if (err) reject(err)
			else {
				const { mtime } = statSync(notePath)
				const content = data.toString()
				resolve({
					id: noteId,
					content,
					lastModified: getFormattedDate(mtime.toString()),
					dateCreated: getFormattedDate(noteId),
				} as Note)
			}
		})
	})
}

export const getAllNotes: ElectronAPIHandle<'getAllNotes'> = async (_) => {
	return new Promise<NoteList>((resolve, reject) => {
		readdir(getVaultPath(), (err, files) => {
			if (err) reject(err)
			const noteArray_promise = files
				.filter((filename) => filename.endsWith('.md'))
				.map((filename) => {
					const noteDate = filename.split('.')[0] as Note['id']
					return _getNote(noteDate)
				})

			return Promise.all(noteArray_promise)
				.then((notesArray) => {
					return notesArray.reduce<NoteList>((acc, currentNote) => {
						return { ...acc, [currentNote.id]: currentNote }
					}, {})
				})
				.then((noteList) => resolve(noteList))
		})
	})
}

/** legacy method - needed for migration purposes (<v1.1.0) */
export const getAllNotesFromElectronStore: ElectronAPIHandle<
	'getAllNotesFromStore'
> = async (_) => {
	return (store.get(`notes`) || {}) as NoteList
}

export const deleteNote: ElectronAPIHandle<'deleteNote'> = async (
	_,
	{ noteId }
) => {
	const notePath = `${getVaultPath()}/${noteId}.md`
	return new Promise((resolve, reject) => {
		try {
			rm(notePath, () => resolve())
		} catch (error) {
			reject(error)
		}
	})
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
