<template>
  <div class="radar">
    <div class="map" ref="mapContainer"></div>
    <SideBar>
      <NavBar></NavBar>
    </SideBar>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import { Map, MapStyle, config } from '@maptiler/sdk'
import { shallowRef, onMounted, onUnmounted, markRaw, type ShallowRef } from 'vue'
import '@maptiler/sdk/dist/maptiler-sdk.css'
import NavBar from '@/components/NavBar.vue'

const mapContainer: ShallowRef<HTMLElement | null> = shallowRef(null)
const map: ShallowRef<Map | null> = shallowRef(null)

onMounted(() => {
  config.apiKey = 'Sgh2cI4VgHs03O2yMbry'

  const initialState = { lng: 15.2551, lat: 48.526, zoom: 4 }

  map.value = markRaw(
    new Map({
      container: mapContainer.value!,
      style: MapStyle.DATAVIZ,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      navigationControl: false,
      geolocateControl: false
    })
  )
}),
  onUnmounted(() => {
    map.value?.remove()
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
