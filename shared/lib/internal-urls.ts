export const appProtocol = 'internal:' as const

type Pages = 'support' | 'github'

const internalUrls: {
	[page in Pages]: {
		ref: `${typeof appProtocol}//${page}`
		url: string
	}
} = {
	support: {
		ref: 'internal://support',
		url: 'https://tally.so/r/wArxyk',
	},
	github: {
		ref: 'internal://github',
		url: 'https://github.com/FrancescoBia/draftify',
	},
} as const

export default internalUrls
