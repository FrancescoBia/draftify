import { store } from './store'
import { mainWindow, clientIsReady, appBaseUrl } from './'

export async function checkAndRunMigration() {
	// check if any migration needs to be runned
	const migrationsArchive = store.get('migration') || {}
	let migrationLog: string[] = []
	const allMigrations = Object.keys(migrationScripts) as AppVersion[]

	for (const version of allMigrations) {
		// run migration if it's either undefined or false
		if (!migrationsArchive[version]) {
			try {
				await migrationScripts[version]().then(() => {
					// migrationsList[version] = true
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
		const vaultPath = store.get('vault.path')
		if (vaultPath) {
			return retryUntilClientIsReady(() => {
				mainWindow.loadURL(`${appBaseUrl}/migrate/v1.1.0`)
				// webContents.send('migration/run', 'v1.1.0')
			})
		} else Promise.reject('Vault path is not defined yet')
	},
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
