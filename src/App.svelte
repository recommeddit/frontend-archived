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
    const res = await (await fetch("https://us-central1-recommeddit.cloudfunctions.net/search?"
      + new URLSearchParams({query}))).json();
    console.log(res);
    const recommendationMap = res.recommendations;
    console.log(recommendationMap);
    for (const recommendation in recommendationMap) {
      console.log(recommendation);
      recommendations.push({
        text: recommendation,
        score: recommendationMap[recommendation]
      });
    }
    recommendations.sort((a, b) => b.score - a.score);
    console.log(recommendations);
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
