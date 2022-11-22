import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import {
	checkIfWorkspaceIdIsSet,
	deleteNote,
	getAllNotes,
	getNote,
	saveNote,
} from './handleLocalDatabase'

console.log({ NODE_ENV: process.env.NODE_ENV })

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
		width: 1000,
		titleBarStyle: 'hidden',
	})

	// and load the index.html of the app.
	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		mainWindow.loadURL('http://localhost:3000')
		mainWindow.webContents.openDevTools()
	} else {
		mainWindow.loadURL('https://journal-ecru.vercel.app')
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

	checkIfWorkspaceIdIsSet()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('note/save', saveNote)
ipcMain.handle('note/get', getNote)
ipcMain.handle('note/getAll', getAllNotes)
ipcMain.handle('note/delete', deleteNote)
