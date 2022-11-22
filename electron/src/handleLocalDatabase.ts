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
