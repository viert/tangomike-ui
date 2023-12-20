import type { MapGeoJSONFeature, MapMouseEvent } from '@maptiler/sdk'

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
