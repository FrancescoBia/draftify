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
// return {
// 	appId: 'app.draftify.app',
// 	productName: 'draftify',
// 	artifactName: 'draftify-${version}-${os}-${arch}.${ext}',
// 	directories: {
// 		output: `dist/${isProd ? 'prod' : 'dev' + '/${buildVersion}'}/main.js`, // ${buildversion} is Electron-builder syntax
// 		buildResources: 'build',
// 	},
// 	generateUpdatesFilesForAllChannels: true,
// 	files: [`build/${isProd ? 'prod' : 'dev'}/**/*`],
// 	// publish: [
// 	// 	{
// 	// 		provider: 'spaces',
// 	// 		name: 'app-dist-files',
// 	// 		region: 'fra1', // https://docs.digitalocean.com/products/platform/availability-matrix/
// 	// 		channel: '${channel}',
// 	// 	},
// 	// 	{
// 	// 		provider: 'github',
// 	// 		private: true,
// 	// 		owner: 'FrancescoBia',
// 	// 		token: process.env.GITHUB_TOKEN,
// 	// 	},
// 	// ],
// 	protocols: {
// 		name: 'draftify',
// 		schemes: ['draftify'],
// 		// schemes: [
// 		// 	process.env.CHANNEL === '' || process.env.CHANNEL === 'latest'
// 		// 		? 'substratum'
// 		// 		: `substratum-${process.env.CHANNEL}`,
// 		// ],
// 	},
// 	mac: {
// 		icon: './assets/app_icon.icns',
// 		category: 'public.app-category.productivity',
// 		hardenedRuntime: true,
// 		darkModeSupport: true,
// 		entitlements: 'entitlements.plist',
// 		entitlementsInherit: 'entitlements.plist',
// 		target: [
// 			{
// 				target: 'dmg',
// 				arch: ['x64', 'arm64'],
// 			},
// 			{
// 				target: 'zip',
// 				arch: ['x64', 'arm64'],
// 			},
// 		],
// 	},
// }
