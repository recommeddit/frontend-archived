<script lang="ts">
  import Title from './components/Title.svelte';
  import SearchInput from './components/SearchInput.svelte';
  import SearchButton from './components/SearchButton.svelte';
</script>

<main class="flex flex-col items-center justify-center h-screen dark:bg-black">
  <Title />
  <SearchInput />
  <SearchButton />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
