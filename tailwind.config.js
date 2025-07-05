/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs",
    "./public/**/*.html" // si luego agregas archivos estáticos
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'transform', 
    'hover:scale-105',
    'hover:shadow-xl',
    'transition',
    'duration-300'
  ],
  plugins: [],
}
