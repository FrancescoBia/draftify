import * as Store from 'electron-store'

const schema = {
	notes: {
		type: 'number',
	},
}

const store = new Store()

export function saveNote({ note }: any) {
	store.set('notes.testNote', note)
}
