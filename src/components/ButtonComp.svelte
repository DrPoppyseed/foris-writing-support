<script>
  import { Link } from 'svelte-routing'
</script>

<Link to="subscribe">
  <div class="btn_subscribe">
    <h2 class="ttl">FORIS ESSAYに応募する</h2>
  </div>
</Link>

<style>
  .btn_subscribe {
    align-items: center;
    padding: 5px 30px 5px;
    background: #9f2b2b;
    text-align: center;
  }

  .ttl {
    color: white;
    font-family: 'Hiragino Kaku Gothic ProN W3';
    font-size: 30px;
  }
</style>
