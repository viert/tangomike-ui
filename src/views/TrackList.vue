<template>
  <div class="track-list-page">
    <header>
      <h5>Track list</h5>
    </header>
    <div class="track-list-filter">
      <ButtonSwitch :options="['mine', 'all']" v-model="mineOption" />
      <ButtonSwitch :options="['active', 'all']" v-model="activeOption" />
    </div>
    <div class="track-list"></div>
  </div>
</template>

<script setup lang="ts">
import { useTrackStore } from '@/stores/tracks'
import { onMounted, ref } from 'vue'
import { useQuery, Convert } from '@/lib/query'
import ButtonSwitch from '@/components/ButtonSwitch.vue'

const store = useTrackStore()
const mineOption = ref('mine')
const activeOption = ref('active')
const { value: page, setValue: setPage } = useQuery('page', Convert.INT)
const { value: mine, setValue: setMine } = useQuery('mine', Convert.BOOL)
const { value: active, setValue: setActive } = useQuery('mine', Convert.BOOL)

store.loadFlightList(mine.value || true, active.value || false, page.value || 1)
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
