module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      parser: '@typescript-eslint/parser', // add the TypeScript parser
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      plugins: [
        'svelte3',
        '@typescript-eslint', // add the TypeScript plugin
      ],
      extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:promise/recommended',
        'prettier',
        'prettier/@typescript-eslint',
      ],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'import/no-mutable-exports': 0,
        'no-labels': 0,
        'no-restricted-syntax': 0,
      },
      settings: {
        'svelte3/typescript': require('typescript'), // pass the TypeScript package to the Svelte plugin
        // ...
      },
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser', // add the TypeScript parser
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      plugins: [
        'svelte3',
        '@typescript-eslint', // add the TypeScript plugin
      ],
      extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:promise/recommended',
        'prettier',
        'prettier/@typescript-eslint',
      ],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'import/no-mutable-exports': 0,
        'no-labels': 0,
        'no-restricted-syntax': 0,
      },
    },
    {
      files: ['*.json', '*.js'],
      extends: 'airbnb-base',
    },
  ],
};
