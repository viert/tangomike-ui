import { createRouter, createWebHistory } from 'vue-router'
import RadarView from '@/views/RadarView.vue'
import TrackList from '@/views/TrackList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tracks',
      name: 'tracks',
      component: TrackList
    },
    {
      path: '/',
      name: 'home',
      component: RadarView
    }
  ]
})

export default router
