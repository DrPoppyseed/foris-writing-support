<div class="container">
  <div class="point">
    <h3 class="ttl">ポイント</h3>
    <h3 class="ttl_num">{$$props.point}</h3>
  </div>
  <div class="text_home">
    <h4 class="ttl">
      {@html $$props.title}
    </h4>
    <p class="description">
      {@html $$props.description}
    </p>
  </div>
</div>

<style>
  .container {
    margin-top: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 830px;
  }
  .point {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 250px;
    width: 250px;
    background: #9f2b2b;
    border-radius: 300px;
    color: white;
    margin-right: 100px;
  }
  .ttl {
    font-size: 35px;
    font-weight: 300;
  }
  .ttl_num {
    font-size: 50px;
  }
  .text_home {
    width: 70%;
  }
  @media screen and (min-width: 1025px) and (max-width: 1280px) {
    .container {
      width: 800px;
    }
    .point {
      margin-right: 80px;
      height: 220px;
      width: 220px;
    }
    .ttl {
      font-size: 30px;
      margin-right: 7px;
    }
    .ttl_num {
      font-size: 40px;
    }
    .text_home {
      margin-top: -20px;
    }
  }
  @media screen and (min-width: 801px) and (max-width: 1024px) {
    .container {
      width: 600px;
    }
    .point {
      height: 160px;
      width: 160px;
    }
    .ttl {
      font-size: 28px;
    }
    .ttl_num {
      font-size: 32px;
    }
    .text_home .ttl {
      font-size: 26px;
    }
  }
  @media screen and (min-width: 481px) and (max-width: 800px) {
    .container {
      width: 90%;
      margin-top: 30px;
    }
    .point {
      height: 120px;
      width: 120px;
      margin-right: 40px;
    }
    .ttl {
      font-size: 20px;
    }
    .ttl_num {
      font-size: 22px;
    }
    .text_home .ttl {
      font-size: 22px;
    }
  }
  @media screen and (max-width: 480px) {
    .container {
      width: 100%;
      margin-top: 20px;
      flex-direction: column;
      align-items: center;
    }
    .point {
      height: 120px;
      width: 120px;
      margin: 0;
      margin-bottom: 10px;
    }
    .ttl {
      font-size: 18px;
      margin: 0;
    }
    .ttl_num {
      font-size: 20px;
    }
    .text_home .ttl {
      font-size: 20px;
      text-align: center;
      width: 100%;
    }
    .text_home {
      width: 90%;
    }
  }
</style>
