<script>
  import { Link } from 'svelte-routing'
</script>

<div class="root">
  <h1 class="ttl">404: ページが見つかりませんでした！</h1>
  <Link to="/"><h3 class="link_style">ホームページに移動する</h3></Link>
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .link_style {
    color: blue;
    opacity: 0.8;
    font-weight: 300;
  }
  .ttl {
    text-align: center;
  }
</style>
