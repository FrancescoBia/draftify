const { exec } = require('child_process')

module.exports = () => {
	const isPublishing =
		process.argv.indexOf('--publish') !== -1 ||
		process.argv.indexOf('-p') !== -1

	// if we are publishing the electron app for distribution,
	// make sure that we are uploading the app only from the main Git branch
	// (this avoids accidental releases of feature branches)
	if (isPublishing) {
		exec('git rev-parse --abbrev-ref HEAD', (err, stdout) => {
			if (err) process.exit()
			const branchName = stdout.trim()
			if (typeof stdout === 'string' && !branchName === 'main') {
				// git branch is != main
				console.log(
					`❌ Prevented the script execution as Git branch is not "main", but "${branchName}"`
				)
				process.exit()
			}
		})
	}

	/**
	 * @type {import('electron-builder').Configuration}
	 * @see https://www.electron.build/configuration/configuration
	 */
	const options = {
		// beforePack: async (context) => {
		// 	console.log({ context })
		// },
		productName: 'Draftify',
		appId: 'app.draftify.app',
		files: [
			'!dist',
			'package.json',
			{
				from: 'build/prod/',
				to: '',
				filter: ['**/*'],
			},
		],
		protocols: {
			name: 'draftify',
			schemes: ['draftify'],
		},
		mac: {
			icon: './assets/app_icon.icns',
			category: 'public.app-category.productivity',
			hardenedRuntime: true,
			darkModeSupport: true,
			target: [
				{
					target: 'dmg',
					arch: ['x64', 'arm64'],
				},
				{
					target: 'zip',
					arch: ['x64', 'arm64'],
				},
			],
		},
		publish: {
			provider: 'spaces',
			name: 'draftify-app',
			region: 'nyc3', // https://docs.digitalocean.com/products/platform/availability-matrix/
		},
	}

	// ----
	return options
}
