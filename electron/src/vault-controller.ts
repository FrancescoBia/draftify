import { dialog } from 'electron'
import fs from 'fs'
import { store } from './store'

export function checkIfVaultIsSet(): string {
	return store.get('vault.path')
}

export async function createVault() {
	return dialog
		.showSaveDialog({
			title: 'Select the location to use for the Draftify file vault',
			defaultPath: 'Documents/Draftify Vault',
			buttonLabel: 'Create Folder',
			properties: ['createDirectory', 'showOverwriteConfirmation'],
			securityScopedBookmarks: true,
		})
		.then((file) => {
			// Stating whether dialog operation was cancelled or not.
			if (!file.canceled) {
				const selectedPath = file.filePath.toString()
				console.log({ selectedPath })

				if (fs.existsSync(selectedPath)) {
					// override the folder if it already exists
					// NB. the user is prompted and asked whether to remove it, so
					// it's fine to directly remove it
					fs.rmdirSync(selectedPath, { recursive: true })
				}

				// create the new vault
				fs.mkdirSync(selectedPath)
				store.set('vault.path', selectedPath)

				return selectedPath
			} else return
		})
		.catch((err) => {
			console.log(err)
		})
}

export async function selectExistingVault() {
	return dialog
		.showOpenDialog({
			title: 'Load your existing Draftify file vault',
			defaultPath: 'Documents',
			buttonLabel: 'Select Folder',
			properties: ['openDirectory'],
		})
		.then((file) => {
			console.log({ file })
			if (!file.canceled && file.filePaths[0]) {
				return store.set('vault.path', file.filePaths[0])
			} else throw new Error('Path incorrectly selected')
		})
}

export function _removeVault() {
	return store.delete('vault')
}
