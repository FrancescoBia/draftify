import ElectronStore from 'electron-store'

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

export const store = new ElectronStore({ schema })