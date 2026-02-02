/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'ping-short': 'ping 0.5s cubic-bezier(0, 0, 0.2, 1) 1',
            }
        },
    },
    plugins: [],
}
