<template>
  <slot v-if="initialised"></slot>
</template>

<script setup lang="ts">
import { useMap } from '@/stores/map'
import type { GeoJSONSource, GeoJSONSourceSpecification } from '@maptiler/sdk'
import { onMounted, onUnmounted, ref, watch } from 'vue'
const props = withDefaults(
  defineProps<{
    sourceId: string
    data: GeoJSON.FeatureCollection
    lineMetrics?: boolean
    cluster?: boolean
    clusterMaxZoom?: number
    clusterRadius?: number
  }>(),
  { lineMetrics: false, cluster: false, clusterMaxZoom: 14, clusterRadius: 30 }
)
const { map } = useMap()
const initialised = ref(false)

onMounted(() => {
  if (map) {
    const sourceOpts: GeoJSONSourceSpecification = {
      type: 'geojson',
      lineMetrics: props.lineMetrics,
      cluster: props.cluster,
      clusterMaxZoom: props.clusterMaxZoom,
      clusterRadius: props.clusterRadius,
      data: props.data
    }
    map.addSource(props.sourceId, sourceOpts)
    initialised.value = true
  }
})

onUnmounted(() => {
  if (map) {
    initialised.value = false
    map.removeSource(props.sourceId)
  }
})

watch(
  () => props.data,
  (newData) => {
    if (map) {
      const source = map.getSource(props.sourceId) as GeoJSONSource | undefined
      if (source) {
        source.setData(newData)
      }
    }
  }
)
</script>

<style scoped></style>
