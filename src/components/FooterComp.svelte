<footer>
  <div class="container">
    <h2 class="ttl">FORIS ESSAY</h2>
    <div class="body_home">
      <a href=""><h3 class="text">利用者規約</h3></a>
      <a href=""><h3 class="text">個人情報取り扱い方針</h3></a>
      <a href=""><h3 class="text">お問い合わせ</h3></a>
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
  @media screen and (min-width: 481px) and (max-width: 800px) {
    footer {
      font-size: 12px;
    }
    .body_home {
      flex-direction: column;
      align-items: center;
    }
    .body_home .text {
      margin-bottom: 10px;
    }
  }
  @media screen and (max-width: 480px) {
    footer {
      font-size: 12px;
    }
    .body_home {
      flex-direction: column;
      align-items: center;
    }
    .body_home .text {
      margin-bottom: 10px;
    }
  }
</style>
