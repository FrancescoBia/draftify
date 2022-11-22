import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
	send: (channel: string, data: any) => {
		ipcRenderer.send(channel, data)
		// whitelist channels
		// let validChannels = ['toMain']
		// if (validChannels.includes(channel)) {
		// 	ipcRenderer.send(channel, data)
		// }
	},
	receive: (channel: string, data: any) => {
		ipcRenderer.on(channel, data)
		// let validChannels = ['fromMain']
		// if (validChannels.includes(channel)) {
		// 	// Deliberately strip event as it includes `sender`
		// 	ipcRenderer.on(channel, (event, ...args) => func(...args))
		// }
	},
})

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
