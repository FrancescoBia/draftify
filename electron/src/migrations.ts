import { store } from './store'
import { mainWindow, clientIsReady, appBaseUrl } from './'
import { ipcMain } from 'electron'

export async function checkAndRunMigration() {
	// check if any migration needs to be runned
	const migrationsArchive = store.get('migration') || {}
	let migrationLog: string[] = []
	const allMigrations = Object.keys(migrationScripts) as AppVersion[]

	for (const version of allMigrations) {
		// needs to be changed in order not to confuse
		// electron-store's dot notation in objects' keys
		const electronStoreVersion = version.replaceAll(
			'.',
			'-'
		) as `v${number}-${number}-${number}`

		// run migration if it's either undefined or false
		if (!migrationsArchive[electronStoreVersion]) {
			try {
				await migrationScripts[version]().then(() => {
					// migrationsArchive[version] = true
					store.set(`migration.${electronStoreVersion}`, true)
					migrationLog.push(version)
				})
			} catch (error) {
				console.error(`❌ Could not run migration version ${version}`, {
					error,
				})
				break
			}
		}
	}

	console.log({
		migrationLog: migrationLog.length
			? migrationLog
			: 'no migrations were runned',
	})
}

// each migration needs to return a boolean stating whether to continue
// (e.g. the preconditions for a migration might be missing)
const migrationScripts: {
	[v: AppVersion]: () => Promise<void>
} = {
	'v1.1.0': async () => {
		return new Promise((resolve, reject) => {
			const vaultPath = store.get('vault.path')
			if (vaultPath) {
				retryUntilClientIsReady(() => {
					ipcMain.on('migration/completed/v1.1.0', () => resolve())
					mainWindow.loadURL(`${appBaseUrl}/migrate/v1.1.0`)
				})
			} else reject('Vault path is not defined yet')
		})
	},
	// 'v2.0.0': async () => {
	// 	console.log('⚠️⚠️⚠️⚠️⚠️ test migration')
	// },
}

async function retryUntilClientIsReady(callback: Function, interval = 100) {
	return new Promise<void>((resolve) => {
		if (clientIsReady) {
			// run directly
			resolve()
		} else {
			let functionHasRunned = false
			// await for client availability
			const myInterval = setInterval(() => {
				console.log('...waiting for client to be ready')

				if (!functionHasRunned) {
					if (clientIsReady) {
						console.log('👍 client is ready - calling')
						resolve()
						clearInterval(myInterval)
					}
				}
			}, interval)
		}
	}).then(() => callback())
}
