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
                    DEFAULT: '#1e40af', // Deep Blue
                    light: '#3b82f6',
                    dark: '#1e3a8a',
                },
                secondary: {
                    DEFAULT: '#64748b', // Slate
                    light: '#f1f5f9',
                    dark: '#334155',
                },
                accent: '#f59e0b', // Amber
                background: '#f8fafc', // Slate 50
                surface: '#ffffff',
                text: {
                    DEFAULT: '#1e293b',
                    light: '#64748b',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
