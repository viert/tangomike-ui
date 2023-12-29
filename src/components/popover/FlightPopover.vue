<template>
  <PopOver :top="position.top" :left="position.left" class="flight-popover">
    <h5>{{ flight.callsign }}</h5>
    <div>
      Flown by {{ flight.user?.first_name }} {{ flight.user?.last_name }} @{{
        flight.user?.username
      }}
    </div>
    <div>{{ flight.aircraft }}</div>
  </PopOver>
</template>

<script setup lang="ts">
import PopOver from './PopOver.vue'
import type { Flight } from '@/api/types'

defineProps<{ flight: Flight; position: { top: number; left: number } }>()
</script>

<style lang="scss">
.flight-popover h5 {
  font-size: 1.2em;
  border-bottom: 1px solid #ccc;
}
</style>
