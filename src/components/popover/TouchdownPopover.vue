<template>
  <PopOver class="touchdown-popover" :top="position.top" :left="position.left">
    <h5>Touchdown</h5>
    <h4>FPM {{ touchdown.vel_nrm.toFixed(3) }}</h4>
    <div class="touchdown-prop">
      <div class="touchdown-prop-key">Bank Angle</div>
      <div class="touchdown-prop-value">{{ touchdown.bank.toFixed(3) }}</div>
    </div>
    <div class="touchdown-prop">
      <div class="touchdown-prop-key">Pitch Angle</div>
      <div class="touchdown-prop-value">{{ touchdown.pitch.toFixed(3) }}</div>
    </div>
    <div class="touchdown-prop">
      <div class="touchdown-prop-key">Heading</div>
      <div class="touchdown-prop-value">{{ touchdown.hdg_mag.toFixed(3) }}</div>
    </div>
  </PopOver>
</template>

<script setup lang="ts">
import PopOver from './PopOver.vue'
import type { TouchDown } from '@/api/types'

defineProps<{ touchdown: TouchDown; position: { top: number; left: number } }>()
</script>

<style lang="scss">
.touchdown-popover h5 {
  text-transform: uppercase;
  font-size: 1.2em;
  border-bottom: 1px solid #ccc;
}

.touchdown-popover h4 {
  font-size: 1.4em;
  font-weight: bold;
  text-align: center;
}

.touchdown-prop {
  display: flex;
  padding: 0 8px;

  .touchdown-prop-key {
    font-weight: bold;
    flex-grow: 1;
  }
  .touchdown-prop-value {
    text-align: right;
  }
}
</style>
