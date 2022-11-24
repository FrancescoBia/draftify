type ElectronAPI = {
	/**
	 * returns promise with status of the save operation
	 */
	saveNote: (data: { note: Note }) => Promise<void>
	/**
	 * This might return undefined if the note does not exist in the database
	 */
	getNote: (data: { noteId: Note['id'] }) => Promise<Note | undefined>
	getAllNotes: () => Promise<NoteList>
	deleteNote: (data: { noteId: Note['id'] }) => Promise<void>
	/**
	 * IMPORTANT!
	 * This is to be used only for testing purposes
	 */
	_deleteAllNotes?: (data: 'delete-all-notes' | undefined) => Promise<void>
}
