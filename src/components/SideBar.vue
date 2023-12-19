<template>
  <div class="sidebar-wrap">
    <div class="sidebar" :class="{ 'sidebar-open': open }">
      <header>
        <h5>Track My Flight</h5>
      </header>
      <slot></slot>
    </div>
    <button @click="open = !open" class="menu">
      <span class="material-symbols-outlined"> menu </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<style lang="scss">
$sidebar-width: 350px;
$sidebar-animation-time: 0.15s;

.sidebar-wrap {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: $sidebar-width;
  pointer-events: none;

  .sidebar {
    position: absolute;
    left: -$sidebar-width;
    pointer-events: all;
    width: $sidebar-width;
    height: 100vh;
    overflow: auto;
    background-color: rgba(255, 255, 255, 0.1);
    border-right: 1px solid #eee;
    transition:
      left $sidebar-animation-time ease,
      background-color $sidebar-animation-time ease;
    &.sidebar-open {
      left: 0;
      background-color: rgba(255, 255, 255, 0.9);
    }

    header {
      padding: 1.25em 1em 0.5em 4.5em;
      background-color: #f0f0f4;
      border-bottom: 1px solid #eee;
      h5 {
        text-transform: uppercase;
        font-weight: bold;
      }
    }
  }

  button.menu {
    border: none;
    background-color: transparent;
    width: 38px;
    height: 38px;
    display: flex;
    padding: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    pointer-events: all;
    position: absolute;
    top: 10px;
    left: 10px;
    text-align: center;

    .material-symbols-outlined {
      transition: font-size 0.1s linear;
      font-size: 28px;
    }

    &:hover .material-symbols-outlined {
      font-size: 36px;
    }
  }
}
</style>
