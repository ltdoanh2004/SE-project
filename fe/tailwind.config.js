/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/flowbite/**/*.js',
	],
	theme: {
		extend: {
			// Customizing colors
			colors: {
				primary: '#F2DBA9', // Your chosen primary color
				secondary: '#4B5563', // Example secondary color, feel free to change
				accent: '#D1D5DB', // Example accent color, feel free to change
			},
			// Optionally customize other theme values such as fonts, spacing, etc.
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
			},
			spacing: {
				128: '32rem', // Example custom spacing
				144: '36rem', // Example custom spacing
			},
			// Add more customizations as needed
		},
	},
	plugins: ['flowbite/plugin'],
}
