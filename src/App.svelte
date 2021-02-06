<script lang="ts">
  import Title from './components/Title.svelte';

  const num = 5;
  num.toString();
</script>

<main class="bg-white dark:bg-black">
  <Title />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
