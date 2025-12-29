/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1', // Indigo
        secondary: '#8B5CF6', // Purple
        accent: '#EC4899', // Pink
        orange: '#FF6B35', // Orange
        yellow: '#FFD93D', // Yellow
      },
      fontFamily: {
        heading: ['"Schoolbell"', 'cursive'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
