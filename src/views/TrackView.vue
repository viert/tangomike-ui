<template>
  <LoadingBlock v-if="isLoading" />
  <MapBox v-else-if="store.center" :lat="store.center.lat" :lng="store.center.lng" :zoom="zoom">
    <FlightTrack :data="store.flight!.track!.points" :style="defaultTrackStyle" />
  </MapBox>
  <div class="track-corrupt" v-else>Track is empty</div>
</template>

<script setup lang="ts">
import FlightTrack from '@/components/FlightTrack.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'
import MapBox from '@/components/map/MapBox.vue'
import { useTrackStore } from '@/stores/tracks'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defaultTrackStyle } from '@/lib/styler'

const route = useRoute()
const router = useRouter()
const store = useTrackStore()
const isLoading = ref(true)

const zoom = computed(() => {
  return 6
  // if (store.bbox === null) return 4
  // const ratio = window.innerWidth / window.innerHeight
  // const bboxWidth = (store.bbox.ne.lng - store.bbox.sw.lng) / ratio
  // const bboxHeight = store.bbox.ne.lat - store.bbox.sw.lat
  // const maxMeasure = Math.min(bboxWidth, bboxHeight)
  // console.log(maxMeasure)
  // if (maxMeasure === 0) return 4
  // return 5.4 / Math.sqrt(maxMeasure)
})

async function reload() {
  isLoading.value = true
  const { flightId } = route.params
  const r = await store.getFlight(flightId as string)
  if (!r) {
    router.replace('/')
    return
  }
  isLoading.value = false
}

watch(
  () => route.params.flightId,
  async () => {
    await reload()
  },
  { immediate: true }
)
</script>

<style lang="scss">
.track-corrupt {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 2em;
  font-family: 'Montserrat';
  text-transform: uppercase;
}
</style>
