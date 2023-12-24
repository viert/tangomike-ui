<template>
  <div class="track-list-page">
    <header>
      <h5>Track list</h5>
    </header>
    <div class="track-list"></div>
  </div>
</template>

<script setup lang="ts">
import { useFlightStore } from '@/stores/flights'
import { useTrackStore } from '@/stores/tracks'

const store = useTrackStore()
store.loadFlightList()
</script>

<style lang="scss">
.track-list-page {
  header {
    padding: 1.25em 1.25em 0.5em;
    background-color: #f0f0f4;
    border-bottom: 1px solid #eee;
    h5 {
      text-transform: uppercase;
      font-weight: bold;
    }
  }

  .track-list {
    padding: 1.25em;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
