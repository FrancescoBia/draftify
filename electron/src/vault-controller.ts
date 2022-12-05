import { BrowserWindow, dialog } from 'electron'
import fs from 'fs'
import { store } from './store'

export function checkIfVaultIsSet(): string {
	return store.get('vault.path')
}

export async function createVault(rendererWindow: BrowserWindow) {
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

				rendererWindow.webContents.send('vault/update', selectedPath)

				return selectedPath
			} else return
		})
}

export async function selectExistingVault(rendererWindow: BrowserWindow) {
	return dialog
		.showOpenDialog({
			title: 'Load your existing Draftify file vault',
			defaultPath: 'Documents',
			buttonLabel: 'Select Folder',
			properties: ['openDirectory'],
		})
		.then((file) => {
			console.log({ paths: file.filePaths })
			if (!file.canceled) {
				const selectedPath = file.filePaths[0]
				store.set('vault.path', selectedPath)

				rendererWindow.webContents.send('vault/update', selectedPath)
				return selectedPath
			} else return
		})
}

export function _removeVault(rendererWindow: BrowserWindow) {
	rendererWindow.webContents.send('vault/update', undefined)
	return store.delete('vault')
}
