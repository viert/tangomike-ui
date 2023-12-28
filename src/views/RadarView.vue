<template>
  <div class="radar">
    <MapBox @click="onMapClick" :images="MAP_IMAGES">
      <MapGeoJSONSource source-id="aircraft" :data="store.aircraftGeoJSON">
        <MapLayer
          layer-id="planes-clustered"
          layer-type="circle"
          :filter="['has', 'point_count']"
          :paint="planeClusterPaint"
        />
        <MapLayer
          layer-id="planes-clustered-count"
          layer-type="symbol"
          :filter="['has', 'point_count']"
          :layout="planeClusterCount"
          :paint="{ 'text-color': 'white' }"
        />
        <MapLayer
          layer-id="planes-unclustered"
          layer-type="symbol"
          :filter="['!has', 'point_count']"
          :layout="planeLayout"
          @mouseenter="onPlaneMouseOver"
          @mouseleave="onPlaneMouseLeave"
          @click="onPlaneClick"
        />
      </MapGeoJSONSource>
      <FlightTrack v-if="store.selected" :flight="store.selected" :style="defaultTrackStyle" />
    </MapBox>
    <FlightPopover v-if="flightOver" :flight="flightOver.flight" :position="flightOver.position" />
    <BottomBar :open="store.selected !== null">
      <FlightStat v-if="store.selected" :flight="store.selected" :slice-size="300" />
    </BottomBar>
  </div>
</template>

<script setup lang="ts">
import BottomBar from '@/components/BottomBar.vue'
import MapBox from '@/components/map/MapBox.vue'
import MapLayer from '@/components/map/MapLayer.vue'
import FlightTrack from '@/components/FlightTrack.vue'
import MapGeoJSONSource from '@/components/map/MapGeoJSONSource.vue'
import { onMounted, onUnmounted, shallowRef } from 'vue'
import { useFlightStore } from '@/stores/flights'
import {
  type LayerEvent,
  planeClusterPaint,
  planeClusterCount,
  planeLayout,
  MAP_IMAGES
} from '@/lib/map'
import { defaultTrackStyle } from '@/lib/styler'
import type { Flight } from '@/api/types'
import FlightPopover from '@/components/FlightPopover.vue'
import FlightStat from '@/components/FlightStat.vue'

interface FlightPopoverConfig {
  flight: Flight
  position: {
    top: number
    left: number
  }
}

const store = useFlightStore()
const flightOver = shallowRef<FlightPopoverConfig | null>(null)
let tm: number | null = null

function onPlaneClick(e: LayerEvent) {
  if (e.features) {
    if (tm) {
      clearTimeout(tm)
      tm = null
    }

    e.features.forEach((feat) => {
      const flightId: string | null = feat.properties.flightId
      if (flightId) {
        store.select(flightId)
      }
    })
  }
}

function onPlaneMouseOver(e: LayerEvent) {
  if (e.features?.length) {
    const feature: GeoJSON.Feature = e.features[0]
    const flightId = feature.properties?.flightId
    if (flightId) {
      flightOver.value = {
        flight: store.active[flightId],
        position: {
          top: e.originalEvent.clientY - 100,
          left: e.originalEvent.clientX - 100
        }
      }
    }
  }
}

function onPlaneMouseLeave() {
  flightOver.value = null
}

function onMapClick() {
  tm = setTimeout(() => {
    store.select(null)
  }, 50)
}

onMounted(() => {
  store.start()
})

onUnmounted(() => {
  store.stop()
})
</script>

<style lang="scss">
.radar {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bottom-bar .track-view-stat {
  height: 100%;
}
</style>
