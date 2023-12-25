import api from '@/api'
import type { Flight, TrackPoint } from '@/api/types'
import { defineStore } from 'pinia'
import { ref, shallowRef, type Ref, type ShallowRef, computed } from 'vue'

export interface BoundingBox {
  sw: {
    lat: number
    lng: number
  }
  ne: {
    lat: number
    lng: number
  }
}

export const useTrackStore = defineStore('tracks', () => {
  const flightList: ShallowRef<Flight[]> = shallowRef([])
  const currentPage = ref(0)
  const totalPages = ref(0)
  const count = ref(0)

  const flight: ShallowRef<Flight | null> = shallowRef(null)
  const bbox = computed(() => {
    if (!flight.value?.track) return null
    if (flight.value.track.points.length === 0) return null
    return calcBoundingBox(flight.value.track.points)
  })
  const center = computed(() => {
    if (bbox.value === null) return null
    return {
      lat: (bbox.value.sw.lat + bbox.value.ne.lat) / 2,
      lng: (bbox.value.sw.lng + bbox.value.ne.lng) / 2
    }
  })

  function dateLineCrossed(points: { lat: number; lng: number }[]) {
    if (points.length < 2) return false

    for (let i = 0; i < points.length - 1; i++) {
      const lng1 = points[i].lng
      const lng2 = points[i + 1].lng
      const dist = Math.abs(lng2 - lng1)
      if (dist > 180) {
        return true
      }
    }
    return false
  }

  function calcBoundingBox(trackPoints: TrackPoint[]): BoundingBox {
    let points = trackPoints.map((p) => ({ lat: p.lat, lng: p.lng }))
    const crossed = dateLineCrossed(points)

    if (crossed) {
      points = points.map((p) => ({ ...p, lng: (p.lng + 360) % 360 }))
    }

    let min_lng = Infinity
    let min_lat = Infinity
    let max_lng = -Infinity
    let max_lat = -Infinity
    points.forEach((p) => {
      if (min_lng > p.lng) min_lng = p.lng
      if (min_lat > p.lat) min_lat = p.lat
      if (max_lng < p.lng) max_lng = p.lng
      if (max_lat < p.lat) max_lat = p.lat
    })

    if (crossed) {
      if (min_lng >= 180) {
        min_lng -= 360
      }
      if (max_lng >= 180) {
        max_lng -= 360
      }
    }

    return {
      sw: {
        lat: min_lat,
        lng: min_lng
      },
      ne: {
        lat: max_lat,
        lng: max_lng
      }
    }
  }

  async function loadFlightList(mine: boolean, active: boolean, page = 1) {
    const resp = await api.flights.list(active, mine, page)
    if (resp) {
      currentPage.value = resp.page
      totalPages.value = resp.total_pages
      count.value = resp.count
      flightList.value = resp.data
    }
    return resp
  }

  function resetFlightList() {
    flightList.value = []
  }

  async function getFlight(flightId: string) {
    const resp = await api.flights.get(flightId)
    if (resp) {
      flight.value = resp.data
    }
    return resp
  }

  function resetFlight() {
    flight.value = null
  }

  return {
    flightList,
    currentPage,
    totalPages,
    count,
    flight,
    bbox,
    center,

    loadFlightList,
    resetFlightList,
    getFlight,
    resetFlight
  }
})
