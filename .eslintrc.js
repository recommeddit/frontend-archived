const eslintSveltePreprocess = require('./eslint-svelte-preprocess');

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    createDefaultProgram: true,
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  extends: ['eslint:recommended'],
  plugins: ['svelte3', '@typescript-eslint', 'prettier'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:promise/recommended',
        'prettier',
        'prettier/@typescript-eslint',
      ],
    },
    {
      files: ['**/!(*.svelte)/*.ts'],
      extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:promise/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
    },
  ],
  settings: {
    'svelte3/preprocess': eslintSveltePreprocess(),
  },
};
