import api from '@/api'
import type { Flight } from '@/api/types'
import { defineStore } from 'pinia'
import { ref, shallowRef, type ShallowRef } from 'vue'

export const useTrackStore = defineStore('tracks', () => {
  const flightList: ShallowRef<Flight[]> = shallowRef([])
  const currentPage = ref(0)
  const totalPages = ref(0)
  const count = ref(0)

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

  return { flightList, currentPage, totalPages, count, loadFlightList }
})
