import { app, BrowserWindow, ipcMain, shell } from 'electron'
import * as path from 'path'
import { autoUpdater } from 'electron-updater'
import {
	checkIfWorkspaceIdIsSet,
	deleteNote,
	getAllNotes,
	getNote,
	saveNote,
	_deleteAllNotes,
} from './notes-controller'
import {
	checkIfVaultIsSet,
	_removeVault,
	createVault,
} from './vault-controller'

console.log({ NODE_ENV: process.env.NODE_ENV })

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
const appBaseUrl = isDev
	? 'http://localhost:3000'
	: 'https://draftify.vercel.app'

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1100,
		height: 800,
		minWidth: 600,
		minHeight: 400,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
		titleBarStyle: 'hidden',
		// frame: false, // this hides the close/minimze controls as well
	})

	// and load the index.html of the app.
	mainWindow.loadURL(appBaseUrl)
	// open dev tools
	if (process.env.NODE_ENV === 'development') {
		mainWindow.webContents.openDevTools()
	}

	// Open the DevTools.
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

	checkIfWorkspaceIdIsSet()
	// vault
	ipcMain.handle('vault/get', checkIfVaultIsSet)
	ipcMain.handle('vault/create', createVault)
	// notes
	ipcMain.handle('note/save', saveNote)
	ipcMain.handle('note/get', getNote)
	ipcMain.handle('note/getAll', getAllNotes)
	ipcMain.handle('note/delete', deleteNote)
	// these methods should not be exposed if node_env != development
	if (isDev) {
		ipcMain.handle('_note/deleteAll', _deleteAllNotes)
		ipcMain.handle('_vault/remove', _removeVault)
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

const URL = require('url').URL

app.on('web-contents-created', (event, contents) => {
	contents.on('will-navigate', (event, navigationUrl) => {
		const parsedUrl = new URL(navigationUrl)
		const appUrl = new URL(appBaseUrl)

		if (parsedUrl.origin !== appUrl.origin) {
			event.preventDefault()
			// This is not a good practice
			// see: https://www.electronjs.org/docs/latest/tutorial/security#how-12
			shell.openExternal(parsedUrl.href)
		}
	})
})
