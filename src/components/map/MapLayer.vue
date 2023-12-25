<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { useMapContext, useMapSourceId } from '@/lib/map'
import type { LayerEvent } from '@/lib/map'
import type { LayerSpecification } from '@maptiler/sdk'
import { onMounted, onUnmounted } from 'vue'

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

const map = useMapContext()
const sourceId = useMapSourceId()

function onMouseEnter(e: LayerEvent) {
  emit('mouseenter', e)
}

function onMouseLeave(e: LayerEvent) {
  emit('mouseleave', e)
}

function onClick(e: LayerEvent) {
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
