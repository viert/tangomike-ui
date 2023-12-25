<template>
  <slot v-if="initialised"></slot>
</template>

<script setup lang="ts">
import { useMapContext } from '@/lib/map'
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
const initialised = ref(false)
const map = useMapContext()

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
  initialised.value = false
  map.removeSource(props.sourceId)
})

watch(
  () => props.data,
  (newData) => {
    const source = map.getSource(props.sourceId) as GeoJSONSource | undefined
    if (source) {
      source.setData(newData)
    }
  }
)

defineExpose({ sourceId: props.sourceId })
</script>
