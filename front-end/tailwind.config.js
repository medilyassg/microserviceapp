/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': 'rgb(55,65,81)',
        'garynav':'rgb(31,41,55)' // Add your custom color
      },

    },
  },
  plugins: [],
};
