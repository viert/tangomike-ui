import './assets/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ApexCharts from 'apexcharts'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $apexcharts: typeof ApexCharts
  }
}

const app = createApp(App)
app.config.globalProperties.$apexcharts = ApexCharts

app.use(createPinia())
app.use(router)
app.directive('focus', { mounted: (el) => el.focus() })

app.mount('#app')
