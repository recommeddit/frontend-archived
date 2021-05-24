<script>
  import { fly } from 'svelte/transition';

  export let recommendations;
  export let isLoading;

  $: console.log(recommendations);
</script>

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
      <!--      <div class="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">-->
      <!--        &lt;!&ndash; Mobile menu button &ndash;&gt;-->
      <!--        <button aria-expanded="false"-->
      <!--                class="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"-->
      <!--                type="button">-->
      <!--          <span class="sr-only">Open menu</span>-->
      <!--          &lt;!&ndash;-->
      <!--            Icon when menu is closed.-->

      <!--            Heroicon name: outline/menu-->

      <!--            Menu open: "hidden", Menu closed: "block"-->
      <!--          &ndash;&gt;-->
      <!--          <svg aria-hidden="true" class="block h-6 w-6" fill="none"-->
      <!--               stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">-->
      <!--            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"-->
      <!--                  stroke-width="2"/>-->
      <!--          </svg>-->
      <!--          &lt;!&ndash;-->
      <!--            Icon when menu is open.-->

      <!--            Heroicon name: outline/x-->

      <!--            Menu open: "block", Menu closed: "hidden"-->
      <!--          &ndash;&gt;-->
      <!--          <svg aria-hidden="true" class="hidden h-6 w-6" fill="none"-->
      <!--               stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">-->
      <!--            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"-->
      <!--                  stroke-width="2"/>-->
      <!--          </svg>-->
      <!--        </button>-->
      <!--      </div>-->
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

<!--&lt;!&ndash; Mobile menu, show/hide based on menu state. &ndash;&gt;-->
<!--<nav aria-label="Global" class="lg:hidden">-->
<!--  <div class="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">-->
<!--    &lt;!&ndash; Current: "bg-gray-100 text-gray-900", Default: "hover:bg-gray-50" &ndash;&gt;-->
<!--    <a aria-current="page"-->
<!--       class="bg-gray-100 text-gray-900 block rounded-md py-2 px-3 text-base font-medium text-gray-900"-->
<!--       href="#">Dashboard</a>-->

<!--    <a class="hover:bg-gray-50 block rounded-md py-2 px-3 text-base font-medium text-gray-900"-->
<!--       href="#">Calendar</a>-->

<!--    <a class="hover:bg-gray-50 block rounded-md py-2 px-3 text-base font-medium text-gray-900"-->
<!--       href="#">Teams</a>-->

<!--    <a class="hover:bg-gray-50 block rounded-md py-2 px-3 text-base font-medium text-gray-900"-->
<!--       href="#">Directory</a>-->
<!--  </div>-->
<!--  <div class="border-t border-gray-200 pt-4 pb-3">-->
<!--    <div class="max-w-3xl mx-auto px-4 flex items-center sm:px-6">-->
<!--      <div class="flex-shrink-0">-->
<!--        <img alt=""-->
<!--             class="h-10 w-10 rounded-full"-->
<!--             src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixqx=1mJ1p9O9Hf&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">-->
<!--      </div>-->
<!--      <div class="ml-3">-->
<!--        <div class="text-base font-medium text-gray-800">Chelsea Hagon</div>-->
<!--        <div class="text-sm font-medium text-gray-500">chelseahagon@example.com</div>-->
<!--      </div>-->
<!--      <button-->
<!--        class="ml-auto flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"-->
<!--        type="button">-->
<!--        <span class="sr-only">View notifications</span>-->
<!--        &lt;!&ndash; Heroicon name: outline/bell &ndash;&gt;-->
<!--        <svg aria-hidden="true" class="h-6 w-6" fill="none" stroke="currentColor"-->
<!--             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">-->
<!--          <path-->
<!--            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"-->
<!--            stroke-linecap="round" stroke-linejoin="round"-->
<!--            stroke-width="2"/>-->
<!--        </svg>-->
<!--      </button>-->
<!--    </div>-->
<!--    <div class="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">-->
<!--      <a-->
<!--        class="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"-->
<!--        href="#">Your-->
<!--        Profile</a>-->

<!--      <a-->
<!--        class="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"-->
<!--        href="#">Settings</a>-->

<!--      <a-->
<!--        class="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"-->
<!--        href="#">Sign-->
<!--        out</a>-->
<!--    </div>-->
<!--  </div>-->
<!--</nav>-->


<!--<div class="bg-white">-->
<!--  <div class="relative overflow-hidden">-->
<!--    &lt;!&ndash;    <header class="relative">&ndash;&gt;-->
<!--    &lt;!&ndash;      <div class="bg-gray-900 pt-6">&ndash;&gt;-->
<!--    &lt;!&ndash;        <nav aria-label="Global"&ndash;&gt;-->
<!--    &lt;!&ndash;             class="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">&ndash;&gt;-->
<!--    &lt;!&ndash;          <div class="flex items-center flex-1">&ndash;&gt;-->
<!--    &lt;!&ndash;            <div class="flex items-center justify-between w-full md:w-auto">&ndash;&gt;-->
<!--    &lt;!&ndash;              <a href="#">&ndash;&gt;-->
<!--    &lt;!&ndash;                <span class="sr-only">Recommeddit</span>&ndash;&gt;-->
<!--    &lt;!&ndash;                <img alt=""&ndash;&gt;-->
<!--    &lt;!&ndash;                     class="h-8 w-auto sm:h-10"&ndash;&gt;-->
<!--    &lt;!&ndash;                     src="/assets/recommeddit.svg">&ndash;&gt;-->
<!--    &lt;!&ndash;              </a>&ndash;&gt;-->
<!--    &lt;!&ndash;              <div class="-mr-2 flex items-center md:hidden">&ndash;&gt;-->
<!--    &lt;!&ndash;                <button aria-expanded="false"&ndash;&gt;-->
<!--    &lt;!&ndash;                        class="bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white"&ndash;&gt;-->
<!--    &lt;!&ndash;                        type="button">&ndash;&gt;-->
<!--    &lt;!&ndash;                  <span class="sr-only">Open main menu</span>&ndash;&gt;-->
<!--    &lt;!&ndash;                  &lt;!&ndash; Heroicon name: outline/menu &ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;                  <svg aria-hidden="true" class="h-6 w-6" fill="none"&ndash;&gt;-->
<!--    &lt;!&ndash;                       stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">&ndash;&gt;-->
<!--    &lt;!&ndash;                    <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"&ndash;&gt;-->
<!--    &lt;!&ndash;                          stroke-width="2"/>&ndash;&gt;-->
<!--    &lt;!&ndash;                  </svg>&ndash;&gt;-->
<!--    &lt;!&ndash;                </button>&ndash;&gt;-->
<!--    &lt;!&ndash;              </div>&ndash;&gt;-->
<!--    &lt;!&ndash;            </div>&ndash;&gt;-->
<!--    &lt;!&ndash;            <div class="hidden space-x-8 md:flex md:ml-10">&ndash;&gt;-->
<!--    &lt;!&ndash;              <a class="text-2xl font-bold text-white hover:text-gray-300"&ndash;&gt;-->
<!--    &lt;!&ndash;                 href="#">Recommeddit</a>&ndash;&gt;-->
<!--    &lt;!&ndash;            </div>&ndash;&gt;-->
<!--    &lt;!&ndash;          </div>&ndash;&gt;-->
<!--    &lt;!&ndash;        </nav>&ndash;&gt;-->
<!--    &lt;!&ndash;      </div>&ndash;&gt;-->
<!--    &lt;!&ndash;    </header>&ndash;&gt;-->
<!--    &lt;!&ndash;    <header class="bg-white shadow-sm lg:static lg:overflow-y-visible">&ndash;&gt;-->
<!--    &lt;!&ndash;      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">&ndash;&gt;-->
<!--    &lt;!&ndash;        <div class="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">&ndash;&gt;-->
<!--    &lt;!&ndash;          <div class="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">&ndash;&gt;-->
<!--    &lt;!&ndash;            <div class="flex-shrink-0 flex items-center">&ndash;&gt;-->
<!--    &lt;!&ndash;              <a href="#">&ndash;&gt;-->
<!--    &lt;!&ndash;                <img class="block h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600" alt="Workflow">&ndash;&gt;-->
<!--    &lt;!&ndash;              </a>&ndash;&gt;-->
<!--    &lt;!&ndash;            </div>&ndash;&gt;-->
<!--    &lt;!&ndash;          </div>&ndash;&gt;-->
<!--    &lt;!&ndash;          <div class="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">&ndash;&gt;-->
<!--    &lt;!&ndash;            <div class="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">&ndash;&gt;-->
<!--    &lt;!&ndash;              <div class="w-full">&ndash;&gt;-->
<!--    &lt;!&ndash;                <label for="search" class="sr-only">Search</label>&ndash;&gt;-->
<!--    &lt;!&ndash;                <div class="relative">&ndash;&gt;-->
<!--    &lt;!&ndash;                  <div class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">&ndash;&gt;-->
<!--    &lt;!&ndash;                    &lt;!&ndash; Heroicon name: solid/search &ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">&ndash;&gt;-->
<!--    &lt;!&ndash;                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />&ndash;&gt;-->
<!--    &lt;!&ndash;                    </svg>&ndash;&gt;-->
<!--    &lt;!&ndash;                  </div>&ndash;&gt;-->
<!--    &lt;!&ndash;                  <input id="search" name="search" class="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search" type="search">&ndash;&gt;-->
<!--    &lt;!&ndash;                </div>&ndash;&gt;-->
<!--    &lt;!&ndash;              </div>&ndash;&gt;-->
<!--    &lt;!&ndash;            </div>&ndash;&gt;-->
<!--    &lt;!&ndash;          </div>&ndash;&gt;-->
<!--    &lt;!&ndash;          <div class="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">&ndash;&gt;-->
<!--    &lt;!&ndash;            &lt;!&ndash; Mobile menu button &ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;            <button type="button" class="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false">&ndash;&gt;-->
<!--    &lt;!&ndash;              <span class="sr-only">Open menu</span>&ndash;&gt;-->
<!--    &lt;!&ndash;              &lt;!&ndash;&ndash;&gt;-->
<!--    &lt;!&ndash;                Icon when menu is closed.&ndash;&gt;-->
<!--    &lt;!&ndash;    &ndash;&gt;-->
<!--    &lt;!&ndash;                Heroicon name: outline/menu&ndash;&gt;-->
<!--    &lt;!&ndash;    &ndash;&gt;-->
<!--    &lt;!&ndash;                Menu open: "hidden", Menu closed: "block"&ndash;&gt;-->
<!--    &lt;!&ndash;              &ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;              <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">&ndash;&gt;-->
<!--    &lt;!&ndash;                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />&ndash;&gt;-->
<!--    &lt;!&ndash;              </svg>&ndash;&gt;-->
<!--    &lt;!&ndash;              &lt;!&ndash;&ndash;&gt;-->
<!--    &lt;!&ndash;                Icon when menu is open.&ndash;&gt;-->
<!--    &lt;!&ndash;    &ndash;&gt;-->
<!--    &lt;!&ndash;                Heroicon name: outline/x&ndash;&gt;-->
<!--    &lt;!&ndash;    &ndash;&gt;-->
<!--    &lt;!&ndash;                Menu open: "block", Menu closed: "hidden"&ndash;&gt;-->
<!--    &lt;!&ndash;              &ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;              <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">&ndash;&gt;-->
<!--    &lt;!&ndash;                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />&ndash;&gt;-->
<!--    &lt;!&ndash;              </svg>&ndash;&gt;-->
<!--    &lt;!&ndash;            </button>&ndash;&gt;-->
<!--    &lt;!&ndash;          </div>&ndash;&gt;-->
<!--    &lt;!&ndash;          <div class="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">&ndash;&gt;-->
<!--    &lt;!&ndash;            <a href="#" class="ml-5 flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">&ndash;&gt;-->
<!--    &lt;!&ndash;              <span class="sr-only">View notifications</span>&ndash;&gt;-->
<!--    &lt;!&ndash;              &lt;!&ndash; Heroicon name: outline/bell &ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">&ndash;&gt;-->
<!--    &lt;!&ndash;                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />&ndash;&gt;-->
<!--    &lt;!&ndash;              </svg>&ndash;&gt;-->
<!--    &lt;!&ndash;            </a>&ndash;&gt;-->

<!--    &lt;!&ndash;            &lt;!&ndash; Profile dropdown &ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;            <div class="flex-shrink-0 relative ml-5">&ndash;&gt;-->
<!--    &lt;!&ndash;              <div>&ndash;&gt;-->
<!--    &lt;!&ndash;                <button type="button" class="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">&ndash;&gt;-->
<!--    &lt;!&ndash;                  <span class="sr-only">Open user menu</span>&ndash;&gt;-->
<!--    &lt;!&ndash;                  <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixqx=1mJ1p9O9Hf&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">&ndash;&gt;-->
<!--    &lt;!&ndash;                </button>&ndash;&gt;-->
<!--    &lt;!&ndash;              </div>&ndash;&gt;-->

<!--    &lt;!&ndash;              &lt;!&ndash;&ndash;&gt;-->
<!--    &lt;!&ndash;                Dropdown menu, show/hide based on menu state.&ndash;&gt;-->
<!--    &lt;!&ndash;    &ndash;&gt;-->
<!--    &lt;!&ndash;                Entering: "transition ease-out duration-100"&ndash;&gt;-->
<!--    &lt;!&ndash;                  From: "transform opacity-0 scale-95"&ndash;&gt;-->
<!--    &lt;!&ndash;                  To: "transform opacity-100 scale-100"&ndash;&gt;-->
<!--    &lt;!&ndash;                Leaving: "transition ease-in duration-75"&ndash;&gt;-->
<!--    &lt;!&ndash;                  From: "transform opacity-100 scale-100"&ndash;&gt;-->
<!--    &lt;!&ndash;                  To: "transform opacity-0 scale-95"&ndash;&gt;-->
<!--    &lt;!&ndash;              &ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;              <div class="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">&ndash;&gt;-->
<!--    &lt;!&ndash;                &lt;!&ndash; Active: "bg-gray-100", Not Active: "" &ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;                <a href="#" class="block py-2 px-4 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>&ndash;&gt;-->

<!--    &lt;!&ndash;                <a href="#" class="block py-2 px-4 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>&ndash;&gt;-->

<!--    &lt;!&ndash;                <a href="#" class="block py-2 px-4 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>&ndash;&gt;-->
<!--    &lt;!&ndash;              </div>&ndash;&gt;-->
<!--    &lt;!&ndash;            </div>&ndash;&gt;-->

<!--    &lt;!&ndash;            <a href="#" class="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">&ndash;&gt;-->
<!--    &lt;!&ndash;              New Project&ndash;&gt;-->
<!--    &lt;!&ndash;            </a>&ndash;&gt;-->
<!--    &lt;!&ndash;          </div>&ndash;&gt;-->
<!--    &lt;!&ndash;        </div>&ndash;&gt;-->
<!--    &lt;!&ndash;      </div>&ndash;&gt;-->
<!--    &lt;!&ndash;    </header>&ndash;&gt;-->

<!--  </div>-->
<!--</div>-->

<div
  class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
  <!--Card 1-->
  {#each recommendations as recommendation}
    <div class="rounded overflow-hidden shadow-lg" in:fly="{{ y: 100, duration: 1000 }}">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{recommendation.text}</div>
        <p class="text-gray-700 text-base">
          Score: {recommendation.score}
        </p>
      </div>
    </div>
  {/each}
</div>