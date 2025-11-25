/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'journey-builder-light-blue': 'rgba(112, 127, 245)',
      },
    },
  },
  plugins: [],
};
