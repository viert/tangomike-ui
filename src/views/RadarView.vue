<template>
  <div class="radar">
    <MapBox :images="MAP_IMAGES">
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
          @click="onPlaneClick"
        />
      </MapGeoJSONSource>
      <FlightTrack
        v-if="store.selected?.track"
        :data="store.selected?.track.points"
        :style="defaultTrackStyle"
      />
    </MapBox>
  </div>
</template>

<script setup lang="ts">
import MapBox from '@/components/map/MapBox.vue'
import MapLayer from '@/components/map/MapLayer.vue'
import FlightTrack from '@/components/FlightTrack.vue'
import MapGeoJSONSource from '@/components/map/MapGeoJSONSource.vue'
import { onMounted, onUnmounted } from 'vue'
import { useFlightStore } from '@/stores/flights'
import {
  type LayerEvent,
  planeClusterPaint,
  planeClusterCount,
  planeLayout,
  MAP_IMAGES
} from '@/lib/map'
import { defaultTrackStyle } from '@/lib/styler'

const store = useFlightStore()

function onPlaneClick(e: LayerEvent) {
  if (e.features) {
    e.features.forEach((feat) => {
      const flightId: string | null = feat.properties.flight_id
      if (flightId) {
        store.select(flightId)
      }
    })
  }
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
</style>
