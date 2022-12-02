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
			defaultPath: 'Documents',
			buttonLabel: 'Create Folder',
			properties: ['createDirectory'],
		})
		.then((file) => {
			console.log({ file })

			// Stating whether dialog operation was cancelled or not.
			if (!file.canceled) {
				const selectedPath = file.filePath.toString()
				console.log({ selectedPath })

				// create folder (NB. this will NOT override a folder if it already exists)
				fs.mkdirSync(selectedPath)

				return store.set('vault.path', file.filePath.toString())
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
