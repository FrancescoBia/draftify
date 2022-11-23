declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'production' | 'development'
			// baseUrl: `http${string}.${string}`
			// CHANNEL: 'alpha' | 'beta' | 'live' | undefined
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
// Note: the snippet above is module augmentation. Files containing module
// augmentation must be modules (as opposed to scripts). The difference
// between modules and scripts is that modules have at least one import/
// export statement.
// In order to make TypeScript treat your file as a module, just add one
// import statement to it. It can be anything. Even export {} will do.
