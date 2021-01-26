<script>
  export let question
  export let answer
</script>

<div class="container">
  <h3 class="question">Q. {question}</h3>
  <p class="answer">{answer}</p>
</div>

<style>
  .container {
    display: block;
    text-align: left;
  }
  .question {
    border-bottom: 0.5px solid white;
  }
  .answer {
  }
</style>
