<template>
  <div class="map" ref="mapContainer">
    <slot v-if="initialised"></slot>
  </div>
</template>

<script setup lang="ts">
import { type ShallowRef, onMounted, onUnmounted, shallowRef, ref } from 'vue'
import { useMap } from '@/stores/map'

const { onLoad, setContainer } = useMap()
const mapContainer: ShallowRef<HTMLElement | null> = shallowRef(null)
const initialised = ref(false)

onMounted(() => {
  setContainer(mapContainer.value!)
})

onUnmounted(() => {
  setContainer(null)
})

onLoad(async () => {
  initialised.value = true
})
</script>

<style lang="scss"></style>
