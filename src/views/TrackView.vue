<template>
  <LoadingBlock v-if="isLoading" />
  <div v-else-if="store.center" class="track-view">
    <MapBox :lat="store.center.lat" :lng="store.center.lng" :zoom="zoom" :images="MAP_IMAGES">
      <FlightTrack :data="store.flight!.track!.points" :style="defaultTrackStyle" />
    </MapBox>
    <div class="track-view-stat">
      <ApexCharts :options="chartOptions" :series="series" height="100%" />
    </div>
  </div>
  <div class="track-corrupt" v-else>Track is empty</div>
</template>

<script setup lang="ts">
import ApexCharts from 'vue3-apexcharts'
import FlightTrack from '@/components/FlightTrack.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'
import MapBox from '@/components/map/MapBox.vue'
import { useTrackStore } from '@/stores/tracks'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defaultTrackStyle } from '@/lib/styler'
import { MAP_IMAGES } from '@/lib/map'

const route = useRoute()
const router = useRouter()
const store = useTrackStore()
const isLoading = ref(true)
const chartOptions = computed(() => {
  const maxAlt = store.flight?.track
    ? Math.max(...store.flight.track.points.map((p) => p.alt_amsl)) + 500
    : 5000
  return {
    chart: {
      id: 'track-stats',
      animations: {
        enabled: false
      }
    },
    xaxis: {
      type: 'datetime'
    },
    colors: ['#3355aa', '#113388', '#cc4444'],
    fill: {
      colors: ['#3355aa20', '#113388']
    },
    stroke: {
      width: 1
    },
    yaxis: [
      {
        title: { text: 'Altitude AMSL' },
        labels: { formatter: (val: number) => `${Math.round(val)} ft` },
        min: 0,
        max: maxAlt
      },
      {
        show: false,
        labels: { formatter: (val: number) => `${Math.round(val)} ft` },
        min: 0,
        max: maxAlt
      },
      {
        opposite: true,
        title: { text: 'Groundspeed' },
        labels: { formatter: (val: number) => `${Math.round(val)} kts` }
      }
    ]
  }
})

const series = computed(() => {
  return [
    {
      name: 'Altitude',
      data: store.flight?.track
        ? store.flight.track.points.map((p) => [p.timestamp, p.alt_amsl])
        : [],
      type: 'area'
    },
    {
      name: 'Ground level',
      data: store.flight?.track
        ? store.flight.track.points.map((p) => [p.timestamp, p.gnd_height])
        : [],
      type: 'area'
    },
    {
      name: 'Groundspeed',
      data: store.flight?.track ? store.flight.track.points.map((p) => [p.timestamp, p.gs]) : [],
      type: 'line'
    }
  ]
})

const zoom = computed(() => {
  // Refer to the link below for understanding the implementation details
  // https://docs.mapbox.com/help/glossary/zoom-level/#zoom-levels-and-geographical-distance
  if (store.bbox === null) return 13
  const ratio = window.innerWidth / (window.innerHeight * 0.4)
  const bboxWidth = store.bbox.ne.lng - store.bbox.sw.lng / ratio
  const bboxHeight = store.bbox.ne.lat - store.bbox.sw.lat
  const maxMeasure = Math.max(bboxWidth, bboxHeight)
  const multiplier = maxMeasure == bboxWidth ? window.innerWidth : window.innerHeight
  const c = (store.center!.lat * (multiplier / 400)) / maxMeasure
  return Math.min(Math.log2(c), 13)
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

.track-view {
  height: 100vh;

  .map {
    height: 60%;
    position: relative;
  }

  .track-view-stat {
    height: 40%;
    padding: 0.5em;
  }
}
</style>
