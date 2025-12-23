/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'sage-green': '#9CAF88',
                'sage-light': '#E8EFE0',
                'rose-red': '#D18888',
                'rose-light': '#FBECEC',
            }
        },
    },
    plugins: [],
}
