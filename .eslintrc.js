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
    ecmaVersion: 2019,
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
      files: ['src/**/*.ts', 'src/**/*.json'],
      extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:promise/recommended',
        'prettier',
        'prettier/@typescript-eslint',
      ],
    },
  ],
  settings: {
    'svelte3/preprocess': eslintSveltePreprocess(),
  },
};
