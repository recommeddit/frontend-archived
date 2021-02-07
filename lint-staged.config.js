module.exports = {
  '*.{cjs,js,ts,json,svelte}': ['prettier --write', 'eslint --fix'],
  '*.svelte': ['svelte-check'],
};
