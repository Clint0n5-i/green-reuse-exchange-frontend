/** @type {import('tailwindcss').Config} */
export default {
    // darkMode removed
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2ecc71', // emerald brand
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                mint: {
                    DEFAULT: '#a5dfc7', // mint accent
                },
                dark: {
                    900: '#000000',
                    800: '#212121',
                    700: '#303030',
                },
            },
            keyframes: {
                claimPulse: {
                    '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(46, 204, 113, 0.7)' },
                    '50%': { transform: 'scale(1.03)', boxShadow: '0 0 0 12px rgba(46, 204, 113, 0)' },
                },
            },
            animation: {
                'claim-pulse': 'claimPulse 1.5s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
