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
                'deep-charcoal': '#2D3436',
                'soft-rose': '#E0BBE4',
                'gold-accent': '#FFD700',
                'glass-white': 'rgba(255, 255, 255, 0.7)',
                'glass-dark': 'rgba(0, 0, 0, 0.5)',
            }
        },
    },
    plugins: [],
}
