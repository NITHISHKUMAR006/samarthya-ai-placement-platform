/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d8eb',
          300: '#94bade',
          400: '#5e96cd',
          500: '#3878b9',
          600: '#275e9b',
          700: '#204c7d',
          800: '#1d4168',
          900: '#0f172a', // Navy Dark Surface
          950: '#0a0f1d',
        },
        brand: {
          blue: '#2563eb',
          teal: '#0d9488',
          indigo: '#4f46e5',
        }
      },
    },
  },
  plugins: [],
}
