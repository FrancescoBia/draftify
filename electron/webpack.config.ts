const path = require('path')
const webpack = require('webpack')

export default function webpackConfig(env: any) {
	console.log({ NODE_ENV: process.env.NODE_ENV })

	const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

	return {
		entry: {
			index: path.resolve(__dirname, 'src', 'index.ts'),
			preload: path.resolve(__dirname, 'src', 'preload.ts'),
		},
		target: 'electron-main',
		mode: isDev ? 'development' : 'production',
		devtool: isDev ? 'source-map' : 'nosources-source-map',
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					exclude: /node_modules/,
					use: ['ts-loader'],
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			}),
		],
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'build', isDev ? 'dev' : 'prod'),
			publicPath: '/',
			clean: true,
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
			},
		},
		stats: {
			errorDetails: true,
		},
	}
}
