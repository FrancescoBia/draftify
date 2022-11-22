import { contextBridge, ipcRenderer } from 'electron'

const electronAPI: ElectronAPI = {
	saveNote: (data) => ipcRenderer.invoke('note/save', data),
	getNote: (data) => ipcRenderer.invoke('note/get', data),
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', electronAPI)

// NB! the stuff below was already included in the template - not sure if to keep
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector: string, text: string) => {
		const element = document.getElementById(selector)
		if (element) {
			element.innerText = text
		}
	}

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(
			`${type}-version`,
			process.versions[type as keyof NodeJS.ProcessVersions]
		)
	}
})
