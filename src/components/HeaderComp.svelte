<header>
  <div class="container">
    <div class="area_logo_header">
      <h1 class="logo">FORIS ESSAY</h1>
    </div>
    <nav class="nav_header">
      <div class="list_nav_header">
        <h3>
          <a class="btn_icon_mail" href="https://form.run/@foris-essay"
            >お問い合わせ</a
          >
        </h3>
      </div>
    </nav>
  </div>
  <div class="container_mobile">
    <h1 class="logo">FORIS ESSAY</h1>
    <div class="button_container">
      <h3>
        <a class="button_link" href="https://form.run/@foris-essay"
          >お問い合わせ</a
        >
      </h3>
    </div>
  </div>
</header>

<style>
  .container {
    display: flex;
    align-items: center;
    max-width: 1160px;
    padding: 0 40px;
    margin: 0 auto;
  }
  .container_mobile {
    display: none;
  }

  .logo {
    color: white;
    font-size: 28px;
    font-family: 'Hiragino Kaku Gothic ProN W3';
    font-weight: 200;
  }

  /* nav */
  .nav_header {
    margin: 0 0 0 auto;
  }

  .list_nav_header {
    display: flex;
    align-items: center;
    margin: 0 -15px;
  }
  .list_nav_header a {
    color: #fff;
    font: 500 18px/1em 'futura', 'noto sans japanese', sans-serif;
  }
  [class*='btn_ico'] {
    font: 400 18px/1em 'futura PT', 'noto sans japanese', sans-serif;
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 30px 0 30px;
    background: #9f2b2b;
    position: relative;
  }
  @media screen and (max-width: 480px) {
    header {
      height: 100px;
    }
    .container {
      display: none;
    }
    .container_mobile {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .logo {
      font-size: 22px;
      margin: 10px 0;
    }
    .button_container {
      background: #9f2b2b;
      padding: 5px;
      width: 90vw;
    }
    h3 {
      text-align: center;
      margin: 0;
      font-weight: 400;
    }
    .button_link {
      color: white;
    }
  }
</style>
