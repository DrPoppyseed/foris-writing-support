<script>
  import { Router, Route } from 'svelte-routing'
  import Home from './routes/Home.svelte'
  import Subscribe from './routes/Subscribe.svelte'
  import NotFound from './routes/NotFound.svelte'

  export let url = ''
</script>

<Router {url}>
  <div>
    <Route path="/" component={Home} />
    <Route path="subscribe" component={Subscribe} />
    <Route path="*" component={NotFound} />
  </div>
</Router>
