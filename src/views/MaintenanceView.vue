<template>
  <div class="whole-damn-page maintenance">
    <div class="maintenance-message">
      <h4>Track My Flight</h4>
      <p>
        There seems to be a problem but we are likely to be aware of it already. This page will
        automatically reload once the problem has resolved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted, onUnmounted } from 'vue'

const store = useAuthStore()
let tm: number | null = null

async function checkResolved() {
  await store.loadAuth()
}

onMounted(() => {
  tm = setInterval(checkResolved, 3000)
})

onUnmounted(() => {
  if (tm) {
    clearInterval(tm)
  }
})
</script>

<style lang="scss">
@use '@/assets/mixins.scss';

.maintenance {
  &::before {
    display: block;
    content: '';
    opacity: 0.5;
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background-image: url('/images/catpilot.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position-y: 40%;
  }
}

.maintenance-message {
  color: white;
  @extend %center-form;
  top: calc(50% - 120px);
  left: calc(50% - 180px);
  width: 360px;
  height: 240px;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  background-color: rgba(0, 0, 0, 0.7);

  p {
    padding: 4em 0;
    text-align: center;
  }
}
</style>
