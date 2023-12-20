import { Map, MapStyle, config } from '@maptiler/sdk'
import { defineStore } from 'pinia'
import { markRaw, watch, type ShallowRef, shallowRef } from 'vue'

const API_KEY = 'Sgh2cI4VgHs03O2yMbry'
const images: Record<string, string> = {
  airplane_jet: '/images/airplane_jet.png',
  airplane_ga: '/images/airplane_ga.png'
}

export const useMap = defineStore('map', () => {
  const mapContainer: ShallowRef<HTMLElement | null> = shallowRef(null)
  const map: ShallowRef<Map | null> = shallowRef(null)
  const onLoadHandlers: ((map: Map) => Promise<void>)[] = []

  function setContainer(el: HTMLElement | null) {
    mapContainer.value = el
  }

  function onLoad(handler: (map: Map) => Promise<void>) {
    onLoadHandlers.push(handler)
  }

  async function loadImages(map: Map) {
    const promises: Promise<{ name: string; image: HTMLImageElement | ImageBitmap }>[] = []
    for (const name in images) {
      promises.push(
        new Promise((resolve, reject) => {
          map.loadImage(images[name], (error, image) => {
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

  watch(mapContainer, (container) => {
    if (container) {
      if (!map.value) {
        config.apiKey = API_KEY
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

        map.value.on('load', async () => {
          ;(window as Record<string, any>).map = map.value
          await loadImages(map.value!)
          await Promise.all(onLoadHandlers.map((handler) => handler(map.value!)))
        })
      }
    } else {
      if (map.value) {
        map.value.remove()
        map.value = null
      }
    }
  })

  return { map, onLoad, setContainer }
})
