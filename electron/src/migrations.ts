import { store } from './store'

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
const migrationScripts: { [v: AppVersion]: () => Promise<void> } = {
	'v1.1.0': async () => {
		console.log('running this')
		return Promise.reject()
	},
}
