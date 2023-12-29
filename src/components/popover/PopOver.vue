<template>
  <div class="map-popover" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ top: number; left: number }>()

const style = {
  bottom: `${window.innerHeight - props.top + 20}px`,
  left: `${props.left - 100}px`
}
</script>

<style lang="scss">
.map-popover {
  position: fixed;
  width: 200px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  font-size: 0.8em;
}
</style>
