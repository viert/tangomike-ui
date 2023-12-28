<template>
  <div class="flight-popover" :style="style">
    <h5>{{ flight.callsign }}</h5>
    <div>
      Flown by {{ flight.user?.first_name }} {{ flight.user?.last_name }} @{{
        flight.user?.username
      }}
    </div>
    <div>{{ flight.aircraft }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Flight } from '@/api/types'

const props = defineProps<{ flight: Flight; position: { top: number; left: number } }>()
const style = {
  top: `${props.position.top}px`,
  left: `${props.position.left}px`
}
</script>

<style lang="scss">
.flight-popover {
  position: fixed;
  width: 200px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);

  h5 {
    font-size: 1.2em;
    border-bottom: 1px solid #ccc;
  }

  font-size: 0.8em;
}
</style>
