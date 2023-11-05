import { createRouter, createWebHistory } from 'vue-router'
import RadarView from '@/views/RadarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RadarView
    }
  ]
})

export default router
