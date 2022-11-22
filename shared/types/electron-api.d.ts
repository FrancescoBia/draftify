type ElectronAPI = {
	/**
	 * returns promise with status of the save operation
	 */
	saveNote: (d: { note: Note }) => Promise<void>
	getNote: (d: { noteId: Note['id'] }) => Promise<Note>
	getAllNotes: () => Promise<NoteList>
}
