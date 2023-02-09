const { version: electronAppVersion } = require('../electron/package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})

		return config
	},
	async rewrites() {
		return [
			{
				source: '/download/latest/mac-intel.dmg',
				destination: `https://github.com/FrancescoBia/draftify/releases/download/v${electronAppVersion}/Draftify-${electronAppVersion}.dmg`,
			},
			{
				source: '/download/latest/mac-silicon.dmg',
				destination: `https://github.com/FrancescoBia/draftify/releases/download/v${electronAppVersion}/Draftify-${electronAppVersion}-arm64.dmg`,
			},
		]
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: 'https://github.com/FrancescoBia/draftify',
				permanent: false,
			},
		]
	},
}

module.exports = nextConfig
