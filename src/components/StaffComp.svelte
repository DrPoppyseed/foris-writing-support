<div class="container {$$props.align || 'right'}">
  <div class="img">
    <img src="imgs/{$$props.imageUrl}" alt={$$props.imageAlt} />
  </div>
  <div class="text_home">
    <h3 class="ttl">{$$props.name}</h3>
    <p class="description">{$$props.description}</p>
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    width: 830px;
    justify-content: space-between;
    margin: 40px 0;
  }
  .right {
    flex-direction: row;
  }
  .left {
    flex-direction: row-reverse;
  }
  img {
    width: 250px;
    height: 250px;
    border-radius: 150px;
  }
  .text_home {
    width: 60%;
  }
  .ttl {
    letter-spacing: 1px;
    font-size: 30px;
    margin-left: 30px;
  }
  @media screen and (min-width: 801px) and (max-width: 1024px) {
    .container {
      width: 600px;
    }
    img {
      width: 180px;
      height: 180px;
      border-radius: 100px;
    }
    .ttl {
      font-size: 24px;
    }
    .description {
      font-size: 16px;
    }
  }
</style>
