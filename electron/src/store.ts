import ElectronStore from 'electron-store'

type MySchema = {
	workspaceId: string
	vault: {
		path: string
	}
}

const schema: ElectronStore.Schema<MySchema> = {
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
