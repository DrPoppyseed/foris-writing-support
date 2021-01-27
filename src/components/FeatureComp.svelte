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
  @media screen and (min-width: 1024px) and (max-width: 1280px) {
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
</style>
