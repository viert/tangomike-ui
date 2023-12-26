<template>
  <div class="map" ref="mapContainer">
    <slot v-if="initialised"></slot>
  </div>
</template>

<script setup lang="ts">
import '@maptiler/sdk/dist/maptiler-sdk.css'
import { type ShallowRef, shallowRef, ref, onMounted, markRaw, onUnmounted } from 'vue'
import { Map, MapStyle, config } from '@maptiler/sdk'

const props = withDefaults(
  defineProps<{
    lat?: number
    lng?: number
    zoom?: number
    images?: Record<string, string>
  }>(),
  {
    lat: 48.526,
    lng: 15.2551,
    zoom: 4,
    images: () => ({})
  }
)

const API_KEY = import.meta.env.VITE_MAPTILER_KEY

async function loadImages(map: Map) {
  const promises: Promise<{ name: string; image: HTMLImageElement | ImageBitmap }>[] = []
  for (const name in props.images) {
    promises.push(
      new Promise((resolve, reject) => {
        map.loadImage(props.images[name], (error, image) => {
          if (error) {
            reject(error)
          } else {
            if (image) {
              resolve({ name, image })
            }
          }
        })
      })
    )
  }
  Promise.all(promises).then((values) => {
    values.forEach((value) => {
      map.addImage(value.name, value.image)
    })
  })
}

const mapContainer: ShallowRef<HTMLElement | null> = shallowRef(null)
const map: ShallowRef<Map | null> = shallowRef(null)
const initialised = ref(false)

onMounted(() => {
  if (!map.value) {
    config.apiKey = API_KEY
    map.value = markRaw(
      new Map({
        container: mapContainer.value!,
        style: MapStyle.DATAVIZ,
        center: [props.lng, props.lat],
        zoom: props.zoom,
        navigationControl: false,
        geolocateControl: false
      })
    )

    map.value.on('load', async () => {
      ;(window as Record<string, any>).map = map.value
      await loadImages(map.value!)
      initialised.value = true
    })
  }
})

onUnmounted(() => {
  map.value!.remove()
})

defineExpose({ map })
</script>

<style lang="scss"></style>
