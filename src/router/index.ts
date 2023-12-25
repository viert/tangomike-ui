import { createRouter, createWebHashHistory } from 'vue-router'
import RadarView from '@/views/RadarView.vue'
import TrackList from '@/views/TrackList.vue'
import TrackView from '@/views/TrackView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tracks',
      name: 'tracks',
      component: TrackList
    },
    {
      path: '/tracks/:flightId',
      name: 'track_view',
      component: TrackView
    },
    {
      path: '/',
      name: 'home',
      component: RadarView
    }
  ]
})

export default router
