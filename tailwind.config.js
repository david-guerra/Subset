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
                    DEFAULT: '#4f46e5',
                    hover: '#4338ca',
                },
                secondary: '#ec4899',
                bg: {
                    body: '#f3f4f6',
                    card: '#ffffff',
                },
                text: {
                    main: '#1f2937',
                    muted: '#6b7280',
                },
                border: '#e5e7eb',
                success: '#10b981',
            },
            borderRadius: {
                DEFAULT: '12px',
            },
            boxShadow: {
                DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            fontFamily: {
                sans: ['"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
