import ElectronStore from 'electron-store'

type MySchema = {
	notes: {
		[noteId: Note['id']]: Note
	}
	workspaceId: string
	vault: {
		path: string
	}
	migration: {
		// `true` if the migration has been completed
		// electron-store uses dot-notation, so the version needs to be
		// updated: from e.g. 'v1.1.0' to 'v1-1-0' to avoid this issue
		[minVersion: `v${number}-${number}-${number}`]: boolean
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
	migration: {
		type: 'object',
		additionalProperties: {
			type: 'boolean',
			default: false,
		},
	},
}

export const store = new ElectronStore({ schema })
