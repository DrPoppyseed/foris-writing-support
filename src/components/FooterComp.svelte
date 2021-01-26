<script>
  import { Link } from 'svelte-routing'
</script>

<footer>
  <div class="container">
    <h2 class="ttl">FORIS ESSAY</h2>
    <div class="body_home">
      <Link to=""><h3 class="text">利用者規約</h3></Link>
      <Link to=""><h3 class="text">個人情婦取り扱い方針</h3></Link>
      <Link to=""><h3 class="text">お問い合わせ</h3></Link>
    </div>
    <p class="copyright">All rights reserved 2021</p>
  </div>
</footer>

<style>
  /* footer */
  footer {
    color: white;
    background: #064780;
    font-size: 15px;
    font-family: 'Hiragino Kaku Gothic ProN W3';
  }
  .container {
    padding: 10px 0 5px;
  }
  .ttl {
    font-family: 'Hiragino Kaku Gothic ProN W3';
    font-size: 30px;
    font-weight: 100;
    text-align: center;
  }
  .copyright {
    text-align: center;
  }
  .body_home {
    display: flex;
    justify-content: center;
    justify-content: space-around;
  }
  .text {
    color: white;
  }
</style>
