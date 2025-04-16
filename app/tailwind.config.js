module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/containers/**/*.{js,ts,jsx,tsx}',
  ],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
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
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
