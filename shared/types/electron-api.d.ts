type ElectronAPI = {
	/**
	 * Returns the version of the Electron app installed.
	 * This can be used to make sure that the client can use certain methods.
	 */
	appVersion: () => string
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
	// various
	// -------------------------
	// Migrations
	onMigrationRun: (
		callback: (event: IpcRendererEvent, version: string) => void
	) => void
	/**
	 * This method is needed to migrate the old notes, from electron-store to the vault folder.
	 * (introduced with v1.1.0)
	 */
	getAllNotesFromStore: () => Promise<NoteList>

	// -------------------------
	/**
	 * IMPORTANT!
	 * This is to be used only for testing purposes
	 */
	_deleteAllNotes?: (data: 'delete-all-notes' | undefined) => Promise<void>
	_removeVault?: () => Promise<void>
}
