/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			dropShadow: {
				icon: '0 2px 10px rgba(0, 0, 0, 0.1)',
			},
			backdropBlur: {
				xs: '3px',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
}
