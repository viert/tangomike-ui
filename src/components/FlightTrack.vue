<template>
  <MapGeoJSONSource :source-id="sourceId" :data="trackGeoJSON" :line-metrics="true">
    <MapLayer :layer-id="compLayerId" layer-type="line" :layout="layout" :paint="paint" />
  </MapGeoJSONSource>
  <MapGeoJSONSource :source-id="`${sourceId}-td`" :data="touchdownGeoJSON">
    <MapLayer
      @mouseenter="onTDMouseEnter"
      @mouseleave="onTDMouseLeave"
      :layer-id="compTDLayerId"
      layer-type="symbol"
      :layout="touchdownLayout"
    />
  </MapGeoJSONSource>
</template>

<script setup lang="ts">
import MapGeoJSONSource from './map/MapGeoJSONSource.vue'
import MapLayer from './map/MapLayer.vue'
import type { Flight } from '@/api/types'
import type { LayerEvent } from '@/lib/map'
import { touchdownLayout } from '@/lib/map'
import { makeStyler, type StylingOption } from '@/lib/styler'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    sourceId?: string
    layerId?: string
    lineWidth?: number
    style?: StylingOption
    flight: Flight
  }>(),
  {
    sourceId: 'selected-track',
    lineWidth: 2
  }
)

const emit = defineEmits<{
  (e: 'touchdown-mouseenter', v: LayerEvent): void
  (e: 'touchdown-mouseleave', v: LayerEvent): void
}>()

const layout = computed(() => ({
  'line-cap': 'round',
  'line-join': 'round'
}))

const compLayerId = computed(() => (props.layerId ? props.layerId : props.sourceId))
const compTDLayerId = computed(() => `${compLayerId.value}-td`)
const styler = props.style ? makeStyler(props.style) : null

const paint = computed(() => {
  const p: Record<string, any> = { 'line-color': 'black', 'line-width': props.lineWidth }
  if (styler) {
    const gradient = styler(props.flight.track!.points)
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
          coordinates: props.flight.track!.points.map((point) => [point.lng, point.lat])
        }
      }
    ]
  }
})

const touchdownGeoJSON = computed(
  (): GeoJSON.FeatureCollection => ({
    type: 'FeatureCollection',
    features: props.flight.track!.touchdowns.map((td, idx) => ({
      type: 'Feature',
      properties: {
        index: idx
      },
      geometry: {
        type: 'Point',
        coordinates: [td.lng, td.lat]
      }
    }))
  })
)

function onTDMouseEnter(e: LayerEvent) {
  emit('touchdown-mouseenter', e)
}

function onTDMouseLeave(e: LayerEvent) {
  emit('touchdown-mouseleave', e)
}
</script>
