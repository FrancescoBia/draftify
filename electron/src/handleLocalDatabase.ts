import * as Store from 'electron-store'

type ElectronAPIHandle<Method extends keyof ElectronAPI> = (
	event: Electron.IpcMainInvokeEvent,
	...arg: Parameters<ElectronAPI[Method]>
) => ReturnType<ElectronAPI[Method]>

const schema = {
	notes: {
		type: 'number',
	},
}

const store = new Store()

export const saveNote: ElectronAPIHandle<'saveNote'> = async (_, { note }) => {
	return store.set(`notes.${note.id}`, note)
}

export const getNote: ElectronAPIHandle<'getNote'> = async (_, { noteId }) => {
	return store.get(`notes.${noteId}`) as Note
}

export const getAllNotes: ElectronAPIHandle<'getAllNotes'> = async (_) => {
	return store.get(`notes`) as NoteList
}
