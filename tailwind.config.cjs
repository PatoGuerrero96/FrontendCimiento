/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html","./src/**/*.jsx"],
  darkMode:"class",
  theme: {
    extend: {
      colors: {
        lila: {
          100: '#9ba4ea',
          200: '#5d5ddb',
          300: '#5624d1',
          400: '#120d35',
        },
        coral:{
          100:"#ffaf9c",
          200:"#f2766b",
          300:"#f23838",
        },
        musgo:{
          100:"#d2ff58",
          200:"#b0e212",
          300:"#B0EE0A"
        }
      },
    },
    fontFamily:{
      'sans': ['Source Sans Pro', 'sans-serif'],
    },
    scale: {
      '110': '1.10',
    },

  },
  plugins: [],
}
