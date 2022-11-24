type ElectronAPI = {
	/**
	 * returns promise with status of the save operation
	 */
	saveNote: (d: { note: Note }) => Promise<void>
	/**
	 * This might return undefined if the note does not exist in the database
	 */
	getNote: (d: { noteId: Note['id'] }) => Promise<Note | undefined>
	getAllNotes: () => Promise<NoteList>
	deleteNote: (d: { noteId: Note['id'] }) => Promise<void>
}
