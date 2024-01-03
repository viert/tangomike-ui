import type { Flight, TouchDown } from '@/api/types'
import { shallowRef } from 'vue'
import type { LayerEvent } from './map'

export interface TouchdownPopoverConfig {
  touchdown: TouchDown
  position: {
    top: number
    left: number
  }
}

export const useTouchdown = (getFlight: () => Flight) => {
  const activeTouchdown = shallowRef<TouchdownPopoverConfig | null>(null)

  function onTouchDownMouseEnter(e: LayerEvent) {
    if (e.features?.length) {
      const feature: GeoJSON.Feature = e.features[0]
      const tdIdx = feature.properties?.index
      if (tdIdx !== undefined) {
        activeTouchdown.value = {
          touchdown: getFlight().track!.touchdowns[tdIdx],
          position: {
            top: e.originalEvent.clientY,
            left: e.originalEvent.clientX
          }
        }
      }
    }
  }

  function onTouchDownMouseLeave() {
    activeTouchdown.value = null
  }

  return { activeTouchdown, onTouchDownMouseEnter, onTouchDownMouseLeave }
}
