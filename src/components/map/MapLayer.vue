<template>
  <slot></slot>
</template>

<script setup lang="ts">
import type { LayerEvent } from '@/maplib'
import { useMap } from '@/stores/map'
import type { LayerSpecification } from '@maptiler/sdk'
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  layerId: string
  layerType: string
  paint?: Record<string, any>
  filter?: (string | number)[]
  layout?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'mouseenter', value: LayerEvent): void
  (e: 'mouseleave', value: LayerEvent): void
  (e: 'click', value: LayerEvent): void
}>()

const { map } = useMap()

function findSourceId() {
  let inst = getCurrentInstance()
  while (inst) {
    if (inst?.type.__name === 'MapGeoJSONSource') {
      return inst.props.sourceId
    }
    inst = inst.parent
  }
  throw Error('Component usage error: MapLayer must be a descendant of a MapGeoJSONSource')
}

const sourceId = findSourceId()

function onMouseEnter(e: LayerEvent) {
  emit('mouseenter', e)
}

function onMouseLeave(e: LayerEvent) {
  emit('mouseleave', e)
}

function onClick(e: LayerEvent) {
  console.log(e.features)
  emit('click', e)
}

onMounted(() => {
  if (map) {
    const opts: Record<string, any> = {
      id: props.layerId,
      source: sourceId,
      type: props.layerType
    }
    if (props.paint) {
      opts.paint = props.paint
    }
    if (props.filter) {
      opts.filter = props.filter
    }
    if (props.layout) {
      opts.layout = props.layout
    }
    map.addLayer(opts as LayerSpecification)
    map.on('mouseenter', props.layerId, onMouseEnter)
    map.on('mouseleave', props.layerId, onMouseLeave)
    map.on('click', props.layerId, onClick)
  }
})

onUnmounted(() => {
  if (map) {
    map.off('mouseenter', props.layerId, onMouseEnter)
    map.off('mouseleave', props.layerId, onMouseLeave)
    map.off('click', props.layerId, onClick)
    map.removeLayer(props.layerId)
  }
})
</script>
