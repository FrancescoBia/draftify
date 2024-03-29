type ElectronAPI = {
	/**
	 * Returns the version of the Electron app installed.
	 * This can be used to make sure that the client can use certain methods.
	 */
	appVersion: () => AppVersion
	// -------------------------
	// VAULT
	getVaultPath: () => Promise<string | undefined>
	createVault: () => Promise<string | undefined>
	selectExistingVault: () => Promise<string | undefined>
	onUpdateVaultPath: (
		callback: (event: IpcRendererEvent, vaultPath: string) => void
	) => void
	// -------------------------
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
	// -------------------------
	/**
	 * IMPORTANT!
	 * This is to be used only for testing purposes
	 */
	_deleteAllNotes?: (data: 'delete-all-notes' | undefined) => Promise<void>
	_removeVault?: () => Promise<void>
}
