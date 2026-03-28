/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        grass: '#2d6a4f',
        dirt: '#c8a96e',
        chalk: '#f0f0f0',
      }
    }
  },
  plugins: []
}
