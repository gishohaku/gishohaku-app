module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/containers/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gishohaku5: '#328BB6',
      },
    },
  },
  variants: {
    extend: {},
  },
  // plugins: [require('@tailwindcss/forms')],
  plugins: [],
}
