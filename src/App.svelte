<script>
  import { Router, Route } from 'svelte-routing'
  import Home from './routes/Home.svelte'
  import NotFound from './routes/NotFound.svelte'

  export let url = ''
</script>

<Router {url}>
  <div>
    <Route path="/" component={Home} />
    <Route path="*" component={NotFound} />
  </div>
</Router>
