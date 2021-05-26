<script lang="ts">
  import ModeSwitcher from './ModeSwitcher.svelte';
  import Tailwindcss from './Tailwindcss.svelte';
  import Landing from './Landing.svelte';
  import SearchList from './SearchList.svelte';

  let isSearching = false;
  let isLoading = false;
  let recommendations = [];

  const handleSearch = async ({detail: query}) => {
    isSearching = true;
    isLoading = true;
    console.log(query);
    const res = await fetch("https://us-central1-recommeddit.cloudfunctions.net/search?"
      + new URLSearchParams({query}));
    const parsedRes = await res.json();
    recommendations = parsedRes.recommendations;
    isLoading = false;
  }
</script>

<style>
</style>

<Tailwindcss/>
<ModeSwitcher/>
{#if isSearching}
  <SearchList {isLoading} {recommendations}/>
{:else}
  <Landing on:search={handleSearch}/>
{/if}
