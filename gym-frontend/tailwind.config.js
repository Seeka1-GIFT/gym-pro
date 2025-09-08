/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2BB0ED',
          50: '#E6F7FE',
          100: '#C9EEFD',
          200: '#95DDFC',
          300: '#61CCFA',
          400: '#2BB0ED',
          500: '#1296D4',
          600: '#0B76A8',
          700: '#075D86',
          800: '#064B6D',
          900: '#053E5B'
        }
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};