/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			dropShadow: {
				icon: '0 2px 10px rgba(0, 0, 0, 0.1)',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
}
