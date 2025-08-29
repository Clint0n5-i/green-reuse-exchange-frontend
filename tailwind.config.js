/** @type {import('tailwindcss').Config} */
export default {
    
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#388e3c', // deep green
                    50: '#e8f5e9',
                    100: '#c8e6c9',
                    200: '#a5d6a7',
                    300: '#81c784',
                    400: '#66bb6a',
                    500: '#4caf50',
                    600: '#43a047',
                    700: '#388e3c',
                    800: '#2e7031',
                    900: '#1b5e20',
                },
                accent: {
                    DEFAULT: '#ffd600', // yellow accent
                    100: '#fff9c4',
                    200: '#fff59d',
                    300: '#fff176',
                    400: '#ffee58',
                    500: '#ffd600',
                },
                mint: {
                    DEFAULT: '#a5dfc7', // mint accent
                },
                sky: {
                    DEFAULT: '#81d4fa', // light blue accent
                },
                dark: {
                    900: '#212121',
                    800: '#303030',
                    700: '#424242',
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
