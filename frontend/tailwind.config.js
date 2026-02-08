/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        patriots: {
          navy: '#002244',
          red: '#c60c30',
          silver: '#b0b7bc',
        },
        seahawks: {
          navy: '#002244',
          green: '#69be28',
          gray: '#a5acaf',
        },
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
