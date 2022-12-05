interface User {
	readonly id: string
}

interface Note {
	readonly id: `20${number}${number}-${number}${number}-${number}${number}` // YYYY-MM-DD
	readonly dateCreated: string
	lastModified: string
	// title?: string
	content: string | undefined
}

interface NoteList {
	[id: Note['id']]: Note
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
