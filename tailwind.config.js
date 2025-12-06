/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    'Inter',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'sans-serif'
                ]
            },
            colors: {
                primary: {
                    DEFAULT: '#4f46e5',
                    hover: '#4338ca'
                },
                secondary: {
                    DEFAULT: '#ec4899',
                    hover: '#db2777'
                },
                bg: {
                    body: '#f9fafb',
                    card: '#ffffff'
                },
                text: {
                    main: '#111827',
                    muted: '#6b7280'
                },
                border: '#e5e7eb'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}
