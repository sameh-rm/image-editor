/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'waikawa-gray': {
          50: '#f2f7fb',
          100: '#e7f0f8',
          200: '#d3e2f2',
          300: '#b9cfe8',
          400: '#9cb6dd',
          500: '#839dd1',
          600: '#6a7fc1',
          700: '#6374ae',
          800: '#4a5989',
          900: '#414e6e',
          950: '#262c40'
        },
        'cerise-red': {
          50: '#fef2f4',
          100: '#fde6e9',
          200: '#fbd0d9',
          300: '#f7aab9',
          400: '#f27a93',
          500: '#e63f66',
          600: '#d42a5b',
          700: '#b21e4b',
          800: '#951c45',
          900: '#801b40',
          950: '#470a1f'
        }
      }
    }
  },
  plugins: []
};
