<script>
  import { fly } from 'svelte/transition';

  import { RingLoader } from 'svelte-loading-spinners'

  export let recommendations;
  export let isLoading;

  $: console.log(`recommendations: ${recommendations}`);
  $: console.log(`isLoading: ${isLoading}`);
</script>

<style>
  .spinner-item {
    position: fixed;
    left: 800px;
    top: 300px;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
</style>

<header class="bg-gray-900 shadow-sm lg:static lg:overflow-y-visible">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
      <div class="flex md:absolute md:left-0 md:inset-y-0 lg:static">
        <div class="flex-shrink-0 flex items-center">
          <a href="#">
            <img alt="Workflow"
                 class="block h-8 w-auto"
                 src="/assets/recommeddit.svg">
          </a>
        </div>
      </div>
      <div
        class="min-w-0 px-0 pt-4 xl:col-span-2 text-2xl font-bold text-white hover:text-gray-300">
        Recommeddit
      </div>
      <div class="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
        <div
          class="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
          <div class="w-full">
            <label class="sr-only" for="search">Search</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <!-- Heroicon name: solid/search -->
                <svg aria-hidden="true" class="h-5 w-5 text-gray-400"
                     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        fill-rule="evenodd"/>
                </svg>
              </div>
              <input
                class="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                id="search"
                name="search"
                placeholder="Search" type="search">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  <nav aria-label="Global" class="lg:hidden">
    <div class="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
      <!-- Current: "bg-gray-100 text-gray-900", Default: "hover:bg-gray-50" -->
      <a aria-current="page"
         class="bg-gray-100 text-gray-900 block rounded-md py-2 px-3 text-base font-medium text-gray-900"
         href="#">Dashboard</a>

      <a class="hover:bg-gray-50 block rounded-md py-2 px-3 text-base font-medium text-gray-900"
         href="#">Calendar</a>

      <a class="hover:bg-gray-50 block rounded-md py-2 px-3 text-base font-medium text-gray-900"
         href="#">Teams</a>

      <a class="hover:bg-gray-50 block rounded-md py-2 px-3 text-base font-medium text-gray-900"
         href="#">Directory</a>
    </div>
    <div class="border-t border-gray-200 pt-4 pb-3">
      <div class="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
        <div class="flex-shrink-0">
          <img alt=""
               class="h-10 w-10 rounded-full"
               src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixqx=1mJ1p9O9Hf&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
        </div>
        <div class="ml-3">
          <div class="text-base font-medium text-gray-800">Chelsea Hagon</div>
          <div class="text-sm font-medium text-gray-500">chelseahagon@example.com</div>
        </div>
        <button
          class="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          type="button">
          <span class="sr-only">View notifications</span>
          <!-- Heroicon name: outline/bell -->
          <svg aria-hidden="true" class="h-6 w-6" fill="none" stroke="currentColor"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2"/>
          </svg>
        </button>
      </div>
      <div class="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
        <a
          class="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          href="#">Your
          Profile</a>

        <a
          class="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          href="#">Settings</a>

        <a
          class="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          href="#">Sign
          out</a>
      </div>
    </div>
  </nav>
</header>

<div
  class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
  <!--Card 1-->
  {#if !isLoading}
    {#each recommendations as recommendation}
      <div class="rounded overflow-hidden shadow-lg" in:fly="{{ y: 100, duration: 1000 }}">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{recommendation.keyword}</div>
          <p class="text-gray-700 text-base">
            Score: {recommendation.score}
          </p>
        </div>
      </div>
    {/each}
  {:else}
    <div class="spinner-item">
      <RingLoader size="80" color="#5CE4E9" unit="px"
                  duration="1s"/>
    </div>
  {/if}
</div>