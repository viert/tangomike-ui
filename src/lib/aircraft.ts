import type { TrackPoint } from '@/api/types'

export function renderTrackPointFeature(
  p: TrackPoint,
  flightId: string,
  aircraftType = 'Jet'
): GeoJSON.Feature {
  let rotation = p.hdg_true - 90
  let icon = 'airplane_jet'
  let size = 0.1
  if (aircraftType !== 'Jet') {
    icon = 'airplane_ga'
    size = 0.014
    rotation += 45
  }
  return {
    type: 'Feature',
    properties: {
      flightId,
      rotation,
      icon,
      size
    },
    geometry: {
      type: 'Point',
      coordinates: [p.lng, p.lat]
    }
  }
}
