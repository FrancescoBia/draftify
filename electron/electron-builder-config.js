module.exports = () => {
	/**
	 * @type {import('electron-builder').Configuration}
	 * @see https://www.electron.build/configuration/configuration
	 */
	const options = {
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
		},
		// beforeBuild: async (context) => {
		// 	console.log({ context })
		// },
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
