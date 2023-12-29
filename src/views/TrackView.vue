<template>
  <LoadingBlock v-if="isLoading" />
  <div v-else-if="store.center" class="track-view">
    <MapBox :lat="store.center.lat" :lng="store.center.lng" :zoom="zoom" :images="MAP_IMAGES">
      <FlightTrack
        :flight="store.flight!"
        :style="defaultTrackStyle"
        @touchdown-mouseenter="onTouchDownMouseEnter"
        @touchdown-mouseleave="onTouchDownMouseLeave"
      />
      <MapGeoJSONSource source-id="aircraft" :data="aircraftGeoJSON">
        <MapLayer
          layer-id="planes-unclustered"
          layer-type="symbol"
          :filter="['!has', 'point_count']"
          :layout="planeLayout"
        />
      </MapGeoJSONSource>
    </MapBox>
    <FlightStat :flight="store.flight!" @mouseover="onMouseOver" />
    <TouchdownPopover
      v-if="activeTouchdown"
      :position="activeTouchdown.position"
      :touchdown="activeTouchdown.touchdown"
    />
  </div>
  <div class="track-corrupt" v-else>Track is empty</div>
</template>

<script setup lang="ts">
import FlightTrack from '@/components/FlightTrack.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'
import MapBox from '@/components/map/MapBox.vue'
import MapLayer from '@/components/map/MapLayer.vue'
import MapGeoJSONSource from '@/components/map/MapGeoJSONSource.vue'
import FlightStat from '@/components/FlightStat.vue'
import TouchdownPopover from '@/components/popover/TouchdownPopover.vue'
import { useTrackStore } from '@/stores/tracks'
import { computed, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defaultTrackStyle } from '@/lib/styler'
import { renderTrackPointFeature } from '@/lib/aircraft'
import { MAP_IMAGES, planeLayout, type LayerEvent } from '@/lib/map'
import type { TrackPoint } from '@/api/types'
import { useTouchdown } from '@/lib/touchdown'

const route = useRoute()
const router = useRouter()
const store = useTrackStore()
const isLoading = ref(true)
const selectedTrackPoint = shallowRef<TrackPoint | null>(null)
const aircraftGeoJSON = computed(() => {
  const features = []
  if (selectedTrackPoint.value) {
    features.push(renderTrackPointFeature(selectedTrackPoint.value, store.flight!.flight_id))
  }
  return {
    type: 'FeatureCollection',
    features
  } as GeoJSON.FeatureCollection
})

const zoom = computed(() => {
  // Refer to the link below for understanding the implementation details
  // https://docs.mapbox.com/help/glossary/zoom-level/#zoom-levels-and-geographical-distance
  if (store.bbox === null) return 13
  const ratio = window.innerWidth / (window.innerHeight * 0.58)
  const bboxWidth = store.bbox.ne.lng - store.bbox.sw.lng / ratio
  const bboxHeight = store.bbox.ne.lat - store.bbox.sw.lat
  const maxMeasure = Math.max(bboxWidth, bboxHeight)
  const multiplier = maxMeasure == bboxWidth ? window.innerWidth : window.innerHeight
  const c = (store.center!.lat * (multiplier / 400)) / maxMeasure
  return Math.min(Math.log2(c), 13)
})

const { activeTouchdown, onTouchDownMouseEnter, onTouchDownMouseLeave } = useTouchdown()

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

function onMouseOver(detail: { seriesIndex: number; dataPointIndex: number }) {
  selectedTrackPoint.value = store.flight!.track!.points[detail.dataPointIndex]
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
    height: 58%;
    position: relative;
  }
}
</style>
