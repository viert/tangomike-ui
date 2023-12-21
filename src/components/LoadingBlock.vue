<template>
  <div class="loading">
    <div class="spinner material-symbols-outlined"></div>
    <h1 class="text">Loading...</h1>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.loading {
  width: 100vw;
  height: 100vh;
  position: relative;

  .spinner {
    position: absolute;
    top: calc(50% - 40px);
    left: calc(50% - 40px);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #36a;
    animation: spin linear 2s infinite;

    &::after {
      display: block;
      content: '\e539';
      position: absolute;
      font-size: 24px;
      top: 9px;
      right: -9px;
      transform: rotate(145deg);
    }
  }
  .text {
    position: absolute;
    top: calc(50% - 20px);
    left: calc(50% - 150px);
    font-size: 32px;
    text-transform: uppercase;
    text-align: center;
    width: 300px;
    margin: auto;
    text-shadow:
      1px 1px 1px white,
      -1px 1px 1px white,
      1px -1px 1px white,
      -1px -1px 1px white;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
