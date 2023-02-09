import { contextBridge, ipcRenderer } from 'electron'
import { version } from '../package.json'

const electronAPI: ElectronAPI = {
	appVersion: () => ('v' + version) as AppVersion,
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
	_removeVault: () => ipcRenderer.invoke('_vault/remove'),
	// Development-only methods
	...((process.env.NODE_ENV === 'development'
		? {
				_deleteAllNotes: () => ipcRenderer.invoke('_note/deleteAll'),
		  }
		: {}) as Partial<ElectronAPI>),
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
