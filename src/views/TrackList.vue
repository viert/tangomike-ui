<template>
  <div class="track-list-page">
    <header></header>
    <div class="track-list-filter">
      <ButtonSwitch :options="['mine', 'all']" v-model="mineOption" />
      <ButtonSwitch :options="['active', 'all']" v-model="activeOption" />
    </div>
    <div class="track-list">
      <TrackListItem v-for="flight in store.flightList" :key="flight.flight_id" :flight="flight" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import TrackListItem from './TrackListItem.vue'
import { useTrackStore } from '@/stores/tracks'
import { computed, ref, watch } from 'vue'
import { useQuery, Convert } from '@/lib/query'

const store = useTrackStore()
const { value: page, setValue: setPage } = useQuery('page', Convert.INT)
const { value: mine, setValue: setMine } = useQuery('mine', Convert.BOOL)
const { value: active, setValue: setActive } = useQuery('active', Convert.BOOL)
const compQuery = computed(() => ({ page: page.value, mine: mine.value, active: active.value }))
const mineOption = ref(mine.value ? 'mine' : 'all')
const activeOption = ref(active.value ? 'active' : 'all')

async function reload() {
  await store.loadFlightList(mine.value || true, active.value || false, page.value || 1)
}

watch(compQuery, reload, { immediate: true })
watch(mineOption, async (nv) => {
  setMine(nv === 'mine')
})
watch(activeOption, async (nv) => {
  setActive(nv === 'active')
})
</script>

<style lang="scss">
.track-list-page {
  header {
    height: 58px;
    background-color: #f7f7fb;
    border-bottom: 1px solid #eee;
    margin-bottom: 0.3rem;
  }

  .track-list {
    padding: 1.25em;
    display: flex;
    flex-wrap: wrap;
  }

  .track-list-filter {
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
