<template>
  <div class="bottom-bar" :class="{ collapsed, open }">
    <slot></slot>
    <div @click="collapsed = !collapsed" class="btn-collapse">
      <span class="material-symbols-outlined"> </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ open: boolean }>()
const collapsed = ref(false)
</script>

<style lang="scss">
.bottom-bar {
  height: 42vh;
  width: 100%;
  position: fixed;
  top: 100vh;
  &.open {
    top: 58vh;
  }

  &.open.collapsed {
    top: calc(100vh - 20px);
    .btn-collapse .material-symbols-outlined::before {
      content: '\e5ce';
    }
  }
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.8);
  border-top: 1px solid #eee;

  .btn-collapse {
    position: absolute;
    top: -16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border: 1px solid #eee;
    background-color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .material-symbols-outlined::before {
      content: '\e5cf';
    }
  }
}
</style>
