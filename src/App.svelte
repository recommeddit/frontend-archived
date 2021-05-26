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
    // const res = await fetch("https://us-central1-recommeddit.cloudfunctions.net/search?"
    //   + new URLSearchParams({query}));
    // const parsedRes = await res.json();
    const parsedRes = {
      'error_message': '',
      'success': true,
      'recommendations': [{
        'keyword': 'visual studio',
        'score': 106.68999999999991
      }, {'keyword': 'ide', 'score': 103.78899999999999}, {
        'keyword': 'vim',
        'score': 82.93300000000002
      }, {'keyword': 'clion', 'score': 54.63999999999998}, {
        'keyword': 'qtcreator',
        'score': 36.88299999999999
      }, {'keyword': 'windows', 'score': 32.53499999999999}, {
        'keyword': 'code',
        'score': 32.115999999999985
      }, {'keyword': 'compiler', 'score': 30.525}, {
        'keyword': 'emacs',
        'score': 29.82899999999999
      }, {'keyword': 'editor', 'score': 28.763999999999996}, {
        'keyword': 'v code',
        'score': 25.66799999999999
      }, {'keyword': 'eclipse', 'score': 25.163999999999998}, {
        'keyword': 'v',
        'score': 24.381999999999998
      }, {'keyword': 'people', 'score': 23.926}, {
        'keyword': 'xcode',
        'score': 23.474999999999998
      }, {'keyword': 'linux', 'score': 23.288999999999998}, {
        'keyword': 'time',
        'score': 21.779
      }, {'keyword': 'build system', 'score': 21.088}, {
        'keyword': 'file',
        'score': 20.930999999999994
      }, {'keyword': 'text editor', 'score': 20.873999999999995}, {
        'keyword': 'tools',
        'score': 20.747
      }, {'keyword': 'cmake', 'score': 19.131}, {
        'keyword': 'students',
        'score': 18.613
      }, {'keyword': 'command line', 'score': 17.901000000000003}, {
        'keyword': 'visual studio code',
        'score': 17.512
      }, {'keyword': 'project', 'score': 16.832999999999995}, {
        'keyword': 'qt creator',
        'score': 16.383
      }, {'keyword': 'point', 'score': 13.054000000000002}, {
        'keyword': 'year',
        'score': 12.769000000000002
      }, {'keyword': 'ides', 'score': 12.761}, {
        'keyword': 'clang',
        'score': 11.748999999999999
      }, {'keyword': 'everything', 'score': 11.350999999999999}, {
        'keyword': 'jobs',
        'score': 11.058
      }, {'keyword': 'warning', 'score': 11.055}, {
        'keyword': 'visual assist',
        'score': 10.909999999999998
      }, {'keyword': 'gdb', 'score': 10.719000000000001}, {
        'keyword': 'work',
        'score': 10.098000000000003
      }, {'keyword': 'terminal', 'score': 9.586}, {
        'keyword': 'atom',
        'score': 9.492
      }, {'keyword': 'kdevelop', 'score': 9.435}, {
        'keyword': 'experience',
        'score': 9.300000000000002
      }, {'keyword': 'vscode', 'score': 9.280000000000001}, {
        'keyword': 'cpp',
        'score': 9.071
      }, {'keyword': 'line', 'score': 8.571}, {
        'keyword': 'teachers',
        'score': 8.559000000000001
      }, {'keyword': 'lot', 'score': 8.546000000000003}, {
        'keyword': 'anything',
        'score': 8.351
      }, {'keyword': 'kit', 'score': 8.116}, {
        'keyword': 'problem',
        'score': 7.992
      }, {'keyword': 'school', 'score': 7.5600000000000005}, {
        'keyword': 'features',
        'score': 7.521000000000003
      }, {'keyword': 'intellisense', 'score': 7.411000000000001}, {
        'keyword': 'header',
        'score': 7.3870000000000005
      }, {'keyword': 'visual studio community', 'score': 7.304}, {
        'keyword': 'cli',
        'score': 7.251
      }, {'keyword': 'poll', 'score': 7.229}, {
        'keyword': 'update',
        'score': 7.117999999999999
      }, {'keyword': 'autocomplete', 'score': 7.102}, {
        'keyword': 'plugins',
        'score': 7.077999999999999
      }, {'keyword': 'large project', 'score': 7.071}, {
        'keyword': 'class',
        'score': 7.067
      }, {'keyword': 'error', 'score': 7.051999999999999}, {
        'keyword': 'command line editor',
        'score': 6.871
      }, {'keyword': 'java', 'score': 6.761}, {
        'keyword': 'thanks',
        'score': 6.728999999999999
      }, {'keyword': 'debugger', 'score': 6.636000000000001}, {
        'keyword': 'different color',
        'score': 6.5009999999999994
      }, {'keyword': 'development environment', 'score': 6.484999999999999}, {
        'keyword': 'options',
        'score': 6.359
      }, {'keyword': 'low level', 'score': 6.295999999999999}, {
        'keyword': 'stuff',
        'score': 6.253
      }, {'keyword': 'bug', 'score': 6.086}, {
        'keyword': 'rtags',
        'score': 6.057
      }, {'keyword': 'source file', 'score': 5.904}, {
        'keyword': 'gcc',
        'score': 5.886
      }, {'keyword': 'mac', 'score': 5.825}, {
        'keyword': 'code completion',
        'score': 5.773999999999999
      }, {'keyword': 'library', 'score': 5.698}, {
        'keyword': 'standard',
        'score': 5.576
      }, {'keyword': 'cquery', 'score': 5.497}, {
        'keyword': 'eclipse cdt',
        'score': 5.452999999999999
      }, {'keyword': 'solutions', 'score': 5.368}, {
        'keyword': 'extension',
        'score': 5.359
      }, {'keyword': 'ideas', 'score': 5.253}, {
        'keyword': 'setup',
        'score': 5.249
      }, {'keyword': 'intellij', 'score': 5.139}, {
        'keyword': 'last time',
        'score': 5.119000000000001
      }, {'keyword': 'development', 'score': 5.04}, {
        'keyword': 'things',
        'score': 5.038
      }, {'keyword': 'youcompleteme', 'score': 5.013999999999999}, {
        'keyword': 'someone',
        'score': 4.919
      }, {'keyword': 'nothing', 'score': 4.851}, {
        'keyword': 'sublime text',
        'score': 4.791
      }, {'keyword': 'cdt', 'score': 4.703}, {
        'keyword': 'support',
        'score': 4.674
      }, {'keyword': 'way', 'score': 4.6739999999999995}, {
        'keyword': 'msvc',
        'score': 4.662
      }, {'keyword': 'difference', 'score': 4.630999999999999}, {
        'keyword': 'new project',
        'score': 4.5969999999999995
      }, {'keyword': 'function', 'score': 4.588}]
    };
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
