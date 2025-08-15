/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 6, 23, 0.10)',
        ring: '0 0 0 1px rgba(99,102,241,0.2), 0 8px 24px rgba(2,6,23,0.12)'
      }
    }
  },
  plugins: []
}
