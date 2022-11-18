interface User {
	readonly id: string
}

interface Note {
	readonly id: string // YYYY-MM-DD
	readonly dateCreated: string
	lastModified: string
	// title?: string
	content: string
}

interface Workspace {
	notes: {
		[noteId: string]: Note
	}
	readonly id: string
}

interface FirestoreSchema {
	workspaces: {
		[workspaceId: string]: Workspace
	}
	user: {
		[userId: string]: User
	}
}
