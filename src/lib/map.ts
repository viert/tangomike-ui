import type { Map } from '@maptiler/sdk'
import { getCurrentInstance, unref } from 'vue'
import type { MapGeoJSONFeature, MapMouseEvent } from '@maptiler/sdk'

export const API_KEY = 'Sgh2cI4VgHs03O2yMbry'
export type LayerEvent = MapMouseEvent & { features?: MapGeoJSONFeature[] }

export const planeClusterPaint = {
  'circle-color': 'rgba(0, 0, 0, 0.5)',
  'circle-radius': ['step', ['get', 'point_count'], 20, 10, 25, 50, 30]
}

export const planeClusterCount = {
  'text-field': '{point_count_abbreviated}',
  'text-font': ['Montserrat'],
  'text-size': 14
}

export const planeLayout = {
  'icon-image': ['get', 'icon'],
  'icon-size': ['get', 'size'],
  'icon-rotate': ['get', 'rotation'],
  'icon-allow-overlap': true
}

export const touchdownLayout = {
  'icon-image': 'arrow_down',
  'icon-size': 0.2,
  'icon-anchor': 'bottom',
  'icon-allow-overlap': true
}

export const MAP_IMAGES: Record<string, string> = {
  airplane_jet: '/images/airplane_jet.png',
  airplane_ga: '/images/airplane_ga.png',
  arrow_down: '/images/arrow_down.png'
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
