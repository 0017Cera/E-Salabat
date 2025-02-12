/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salabat: {
          50: '#FFF8E6',
          100: '#FFF1CC',
          200: '#FFE299',
          300: '#FFD466',
          400: '#FFC733',
          500: '#FFB800', // Primary brand color
          600: '#CC9300',
          700: '#996E00',
          800: '#664A00',
          900: '#332500',
        },
        ginger: {
          50: '#FDF8F3',
          100: '#F9E8D5',
          200: '#F3D1AA',
          300: '#EDBA7F',
          400: '#E7A354',
          500: '#E18C29', // Secondary brand color
          600: '#B46F21',
          700: '#875319',
          800: '#5A3710',
          900: '#2D1B08',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}