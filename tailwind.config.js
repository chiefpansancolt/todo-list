/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './renderer.js'],
	darkMode: 'class',
	theme: {
		extend: {
			animation: {
				'fade-out': 'fadeOut 0.5s ease-out forwards',
				'slide-in': 'slideIn 0.3s ease-out',
			},
			keyframes: {
				fadeOut: {
					'0%': { opacity: '1', transform: 'scale(1)' },
					'100%': { opacity: '0', transform: 'scale(0.95)' },
				},
				slideIn: {
					'0%': { opacity: '0', transform: 'translateY(-10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			colors: {
				primary: {
					50: '#eff6ff',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
				},
			},
		},
	},
	plugins: [],
};
