interface User {}

interface Note {
	dateCreated: string
	lastModified: string
	title?: string
	content: string
	workspaceId: string
}

interface Workspace {}
