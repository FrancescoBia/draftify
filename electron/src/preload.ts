import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { version } from '../package.json'

const electronAPI: ElectronAPI = {
	appVersion: () => version,
	// vault
	getVaultPath: () => ipcRenderer.invoke('vault/get'),
	createVault: () => ipcRenderer.invoke('vault/create'),
	selectExistingVault: () => ipcRenderer.invoke('vault/select-existing'),
	onUpdateVaultPath: (callback) => ipcRenderer.on('vault/update', callback),
	// notes
	saveNote: (data) => ipcRenderer.invoke('note/save', data),
	getNote: (data) => ipcRenderer.invoke('note/get', data),
	getAllNotes: () => ipcRenderer.invoke('note/getAll'),
	deleteNote: (data) => ipcRenderer.invoke('note/delete', data),
	// ---------------------------------
	// Development-only methods
	...((process.env.NODE_ENV === 'development'
		? {
				_deleteAllNotes: () => ipcRenderer.invoke('_note/deleteAll'),
				_removeVault: () => ipcRenderer.invoke('_vault/remove'),
		  }
		: {}) as Partial<ElectronAPI>),
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// // NB! the stuff below was already included in the template - not sure if to keep
// // All of the Node.js APIs are available in the preload process.
// // It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
// 	const replaceText = (selector: string, text: string) => {
// 		const element = document.getElementById(selector)
// 		if (element) {
// 			element.innerText = text
// 		}
// 	}

// 	for (const type of ['chrome', 'node', 'electron']) {
// 		replaceText(
// 			`${type}-version`,
// 			process.versions[type as keyof NodeJS.ProcessVersions]
// 		)
// 	}
// })
