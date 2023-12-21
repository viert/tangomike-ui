import Axios from 'axios'
import { wrap } from './wrap'
import type { Flight, Pagination } from './types'

export const flights = {
  async list(active = true, mineOnly = false, page = 1) {
    const url = `/api/v1/flights/?my=${mineOnly}&active=${active}&page=${page}`
    return wrap<Pagination<Flight>>(Axios.get(url))
  },

  async get(flightId: string) {
    return wrap<{ data: Flight }>(Axios.get(`/api/v1/flights/${flightId}`))
  },

  watch(flightId: string) {
    return new EventSource(`/api/v1/flights/${flightId}/watch`)
  }
}
