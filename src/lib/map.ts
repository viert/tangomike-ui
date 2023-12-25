import type { Map } from '@maptiler/sdk'
import { getCurrentInstance, unref } from 'vue'

export const API_KEY = 'Sgh2cI4VgHs03O2yMbry'

export const MAP_IMAGES: Record<string, string> = {
  airplane_jet: '/images/airplane_jet.png',
  airplane_ga: '/images/airplane_ga.png'
}

export function useMapContext(): Map {
  let node = getCurrentInstance()
  while (node) {
    if (node.exposed?.map) {
      return unref(node.exposed.map)
    }
    node = node.parent
  }
  throw Error('component must be a child of a MapBox component')
}

export function useMapSourceId(): string {
  let node = getCurrentInstance()
  while (node) {
    if (node.type.__name === 'MapGeoJSONSource' && node.exposed?.sourceId) {
      return unref(node.exposed.sourceId)
    }
    node = node.parent
  }
  throw Error('component must be a child of a MapGeoJSONSource component')
}
