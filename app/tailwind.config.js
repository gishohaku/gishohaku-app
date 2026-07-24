/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/containers/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gishohaku5: '#328BB6',
        gishohaku6: '#328BB6',
        gishohaku7: '#35A6DF',
        gishohaku8: '#81B4C5',
        gishohaku9: '#F3B7AE',
        gishohaku10: '#C1D1EB',
        gishohaku11: '#C1D1EB',
        gishohaku12: '#C1D1EB',
        gishohaku13: '#C1D1EB',
      },
    },
  },
}
