<div class="container .{$$props.align}">
  <div class="img">
    <img src="imgs/{$$props.imageUrl}" alt={$$props.imageAlt} />
  </div>
  <div class="text_home">
    <p class="ttl">{$$props.name}</p>
    <p class="description">{$$props.description}</p>
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }
  .right {
    flex-direction: row;
  }
  .left {
    flex-direction: row-reverse;
  }
  img {
    width: 200px;
    height: 200px;
    border-radius: 100px;
  }
</style>
