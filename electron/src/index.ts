import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import * as path from 'path'
import { autoUpdater } from 'electron-updater'
import {
	checkIfWorkspaceIdIsSet,
	deleteNote,
	getAllNotes,
	getNote,
	saveNote,
} from './notes-controller'
import {
	checkIfVaultIsSet,
	createVault,
	selectExistingVault,
	_removeVault,
} from './vault-controller'
import internalUrls, { appProtocol } from '../../client/src/lib/internal-urls'

console.log({ NODE_ENV: process.env.NODE_ENV })

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

export let mainWindow: BrowserWindow
export let clientIsReady = false

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 800,
		minWidth: 600,
		minHeight: 400,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
		titleBarStyle: 'hidden',
	})

	// and load the index.html of the app.
	if (isDev) {
		console.log('Running client from Dev Server')
		mainWindow.loadURL('http://localhost:3000')
	} else {
		mainWindow.loadFile(path.join(__dirname, 'client', 'index.html'))
	}

	// Open the DevTools
	if (process.env.NODE_ENV === 'development') {
		mainWindow.webContents.openDevTools()
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow()

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})

	// --------------------
	mainWindow.webContents.on('did-finish-load', () => {
		// console.log('client has loaded')
		clientIsReady = true
	})

	checkIfWorkspaceIdIsSet()
	// vault
	ipcMain.handle('vault/get', checkIfVaultIsSet)
	ipcMain.handle('vault/create', () => createVault(mainWindow))
	ipcMain.handle('vault/select-existing', () => selectExistingVault(mainWindow))
	// notes
	ipcMain.handle('note/save', saveNote)
	ipcMain.handle('note/get', getNote)
	ipcMain.handle('note/getAll', getAllNotes)
	ipcMain.handle('note/delete', deleteNote)

	// these methods should not be exposed if node_env != development
	if (isDev) {
		ipcMain.handle('_vault/remove', () => _removeVault(mainWindow))
	}

	// --------------------
	autoUpdater.checkForUpdatesAndNotify()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('web-contents-created', (_, contents) => {
	contents.on('will-navigate', (event, navigationUrl) => {
		// Load only allowed urls
		// see: https://www.electronjs.org/docs/latest/tutorial/security#how-12

		event.preventDefault()
		const protocol = navigationUrl.split('//')[0]

		// url is a reference to a known url
		if (protocol === appProtocol) {
			// get page
			const page = navigationUrl.split('//').pop()

			if (page in internalUrls) {
				shell.openExternal(internalUrls[page as keyof typeof internalUrls].url)
			}
		}
		// unrecognized url (e.g. external link) - ask before opening
		else {
			dialog
				.showMessageBox(mainWindow, {
					message: 'Open external url in browser?',
					detail: navigationUrl,
					type: 'info',
					buttons: ['open', 'cancel'],
					defaultId: 0,
				})
				.then(({ response }) => {
					if (response === 0) {
						shell.openExternal(navigationUrl)
					}
				})
		}
	})
})
