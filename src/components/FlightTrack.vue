<template>
  <MapGeoJSONSource :source-id="sourceId" :data="trackGeoJSON" :line-metrics="true">
    <MapLayer :layer-id="compLayerId" layer-type="line" :layout="layout" :paint="paint" />
  </MapGeoJSONSource>
</template>

<script setup lang="ts">
import MapGeoJSONSource from './map/MapGeoJSONSource.vue'
import MapLayer from './map/MapLayer.vue'
import { computed } from 'vue'
import type { TrackPoint } from '@/api/types'
import { makeStyler, type StylingOption } from '@/lib/styler'

const props = withDefaults(
  defineProps<{
    sourceId?: string
    layerId?: string
    lineWidth?: number
    style?: StylingOption
    data: TrackPoint[]
  }>(),
  {
    sourceId: 'selected-track',
    lineWidth: 3
  }
)

const layout = computed(() => ({
  'line-cap': 'round',
  'line-join': 'round'
}))

const compLayerId = computed(() => (props.layerId ? props.layerId : props.sourceId))

const paint = computed(() => {
  const p: Record<string, any> = { 'line-color': 'black', 'line-width': props.lineWidth }
  if (props.style) {
    const styler = makeStyler(props.style)
    const gradient = styler(props.data)
    if (gradient && gradient.length > 0) {
      p['line-gradient'] = ['interpolate', ['linear'], ['line-progress'], ...gradient]
    }
  }
  return p
})

const trackGeoJSON = computed((): GeoJSON.FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: props.data.map((point) => [point.lng, point.lat])
        }
      }
    ]
  }
})
</script>
