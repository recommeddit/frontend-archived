const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class', // This can be 'media' if preferred.
  mode: 'jit',
  purge: [
    './src/**/*.svelte',
    './src/**/*.html',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        cyan: colors.cyan,
        svelte: '#ff3e00',
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
