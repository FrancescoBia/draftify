require('dotenv').config()
const { notarize } = require('electron-notarize')

exports.default = async (context) => {
	const { electronPlatformName, appOutDir } = context
	if (electronPlatformName !== 'darwin') {
		return
	}
	console.log('started notarization process')

	const appName = context.packager.appInfo.productFilename

	return await notarize({
		tool: 'notarytool',
		appPath: `${appOutDir}/${appName}.app`,
		appleId: process.env.APPLE_ID_EMAIL,
		appleIdPassword: process.env.APPLE_ID_PASSWORD,
		teamId: process.env.APPLE_TEAM_ID,
	})
}
