/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f7',
          100: '#ccefee',
          200: '#99dfde',
          300: '#66cfcd',
          400: '#33bfbc',
          500: '#00afab',
          600: '#008c89',
          700: '#006967',
          800: '#004644',
          900: '#002322',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        ethereal: {
          primary: '#0052d1',
          'primary-container': '#156aff',
          secondary: '#006970',
          'secondary-container': '#7af1fc',
          surface: '#f7f9fb',
          'surface-low': '#f2f4f6',
          'surface-lowest': '#ffffff',
          'on-surface': '#191c1e',
          'on-surface-variant': '#414754',
          'outline-variant': '#c1c6d7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ambient': '0 20px 40px rgba(25, 28, 30, 0.06)',
      }
    },
  },
  plugins: [],
}
