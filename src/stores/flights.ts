import { defineStore } from 'pinia'
import { computed, reactive, shallowRef, type ShallowReactive, type ShallowRef } from 'vue'
import type { Flight, FlightEvent, TouchDown, TrackPoint } from '@/api/types'
import api from '@/api'

interface SubscriptionDescriptor {
  source: EventSource
  handlers: {
    trackpoint: (e: MessageEvent<string>) => void
    touchdown: (e: MessageEvent<string>) => void
    flightEvent: (e: MessageEvent<string>) => void
  }
}

export const useFlightStore = defineStore('flights', () => {
  const active: ShallowReactive<Record<string, Flight>> = reactive({})
  const subscriptions: Record<string, SubscriptionDescriptor> = {}
  const selected: ShallowRef<Flight | null> = shallowRef(null)

  let timer: number | null = null

  function subscribe(flightId: string) {
    const sub = api.flights.watch(flightId)

    const sd: SubscriptionDescriptor = {
      source: sub,
      handlers: {
        trackpoint: (e: MessageEvent<string>) => {
          const point = JSON.parse(e.data) as TrackPoint
          if (!active[flightId].track) {
            active[flightId].track = { points: [], touchdowns: [] }
          }
          active[flightId].track?.points.push(point)
        },
        touchdown: (e: MessageEvent<string>) => {
          const touchdown = JSON.parse(e.data) as TouchDown
          if (!active[flightId].track) {
            active[flightId].track = { points: [], touchdowns: [] }
          }
          active[flightId].track?.touchdowns.push(touchdown)
        },
        flightEvent: (e: MessageEvent<string>) => {
          const event = JSON.parse(e.data) as FlightEvent
          if (event.eventType === 'close') {
            unsubscribe(flightId)
          }
        }
      }
    }

    sub.addEventListener('trackpoint', sd.handlers.trackpoint)
    sub.addEventListener('touchdown', sd.handlers.touchdown)
    sub.addEventListener('flightEvent', sd.handlers.flightEvent)
    subscriptions[flightId] = sd
  }

  function unsubscribe(flightId: string) {
    const sd = subscriptions[flightId]
    if (sd) {
      sd.source.removeEventListener('trackpoint', sd.handlers.trackpoint)
      sd.source.removeEventListener('touchdown', sd.handlers.touchdown)
      sd.source.removeEventListener('flightEvent', sd.handlers.flightEvent)
      sd.source.close()
      delete subscriptions[flightId]
    }
  }

  function unsubscribeAll() {
    const flightIds = Object.keys(subscriptions)
    flightIds.forEach(unsubscribe)
  }

  function select(flightId: string | null) {
    if (!flightId) {
      selected.value = null
    } else {
      selected.value = active[flightId] || null
    }
  }

  async function loadActiveList() {
    if (timer === null) return

    const data = await api.flights.list()

    const flightIds = new Set()
    if (data != null) {
      data.data.forEach(async (flight) => {
        flightIds.add(flight.flight_id)
        if (!(flight.flight_id in active)) {
          const fullFlight = await api.flights.get(flight.flight_id)
          if (fullFlight) {
            active[flight.flight_id] = fullFlight.data
          }
          subscribe(flight.flight_id)
        }
      })

      for (const flightId in active) {
        if (!flightIds.has(flightId)) {
          delete active[flightId]
          unsubscribe(flightId)
        }
      }
    }
  }

  function start() {
    if (timer !== null) {
      stop()
    }
    timer = setInterval(loadActiveList, 5000)
    loadActiveList()
  }

  function stop() {
    if (timer !== null) {
      unsubscribeAll()
      clearInterval(timer)
      timer = null
    }
  }

  const aircraftGeoJSON = computed(() => {
    const data: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    }

    for (const flight_id in active) {
      const flight = active[flight_id]
      const last = flight.track!.points[flight.track!.points.length - 1]
      let rotation = last.hdg_true - 90
      const atype = 'Jet' // TODO actual aircraft types

      let icon = 'airplane_jet'
      let size = 0.1
      if (atype !== 'Jet') {
        icon = 'airplane_ga'
        size = 0.014
        rotation += 45
      }
      const feature: GeoJSON.Feature = {
        type: 'Feature',
        properties: {
          flight_id,
          rotation,
          icon,
          size
        },
        geometry: {
          type: 'Point',
          coordinates: [last.lng, last.lat]
        }
      }

      data.features.push(feature)
    }

    return data
  })

  const trackGeoJSON = computed(() => {
    if (!selected.value) return null
    if (!selected.value.track) return null
    const data: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            callsign: selected.value.callsign,
            flight_id: selected.value.flight_id
          },
          geometry: {
            type: 'LineString',
            coordinates: selected.value.track.points.map((point) => [point.lng, point.lat])
          }
        }
      ]
    }
    return data
  })

  return { start, stop, active, aircraftGeoJSON, trackGeoJSON, selected, select }
})
