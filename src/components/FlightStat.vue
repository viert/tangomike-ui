<template>
  <div class="track-view-stat">
    <div class="track-view-stat-header">
      <h5>{{ flight.departure || '...' }} - {{ flight.arrival || '...' }}</h5>
      <div>
        {{ flight.aircraft }} <b>{{ flight.callsign }}</b> by {{ flight.user?.first_name }}
        {{ flight.user?.last_name }} @{{ flight.user?.username }} on {{ datetime }}
      </div>
    </div>
    <div class="track-view-stat-graph">
      <ApexCharts
        :options="chartOptions"
        :series="series"
        height="100%"
        @mouse-move="onMouseMove"
        @mouse-leave="onMouseLeave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ApexCharts from 'vue3-apexcharts'
import type { Flight } from '@/api/types'
import { computed } from 'vue'

const props = defineProps<{ flight: Flight; sliceSize?: number }>()
const emit = defineEmits<{
  (e: 'mouseover', v: { seriesIndex: number; dataPointIndex: number }): void
  (e: 'mouseleave'): void
}>()
const chartOptions = computed(() => {
  const maxAlt = props.flight.track
    ? Math.max(...props.flight.track.points.map((p) => p.alt_amsl)) + 500
    : 5000
  return {
    chart: {
      id: 'track-stats',
      animations: {
        enabled: false
      }
    },
    xaxis: {
      type: 'datetime'
    },
    colors: ['#3355aa', '#118833', '#cc4444'],
    fill: {
      colors: ['#3355aa20', '#118833']
    },
    stroke: {
      width: 1
    },
    yaxis: [
      {
        title: { text: 'Altitude AMSL' },
        labels: { formatter: (val: number) => `${Math.round(val)} ft` },
        min: 0,
        max: maxAlt
      },
      {
        show: false,
        labels: { formatter: (val: number) => `${Math.round(val)} ft` },
        min: 0,
        max: maxAlt
      },
      {
        opposite: true,
        title: { text: 'Groundspeed' },
        labels: { formatter: (val: number) => `${Math.round(val)} kts` }
      }
    ]
  }
})

const series = computed(() => {
  const slice = props.sliceSize ? -props.sliceSize : 0
  return [
    {
      name: 'Altitude',
      data: props.flight.track
        ? props.flight.track.points.map((p) => [p.timestamp, p.alt_amsl]).slice(slice)
        : [],
      type: 'area'
    },
    {
      name: 'Ground level',
      data: props.flight.track
        ? props.flight.track.points.map((p) => [p.timestamp, p.gnd_height]).slice(slice)
        : [],
      type: 'area'
    },
    {
      name: 'Groundspeed',
      data: props.flight.track
        ? props.flight.track.points.map((p) => [p.timestamp, p.gs]).slice(slice)
        : [],
      type: 'line'
    }
  ]
})

const datetime = computed(() => new Date(props.flight.created_at).toLocaleString())

function onMouseMove(_1: any, _2: any, config: { seriesIndex: number; dataPointIndex: number }) {
  emit('mouseover', { seriesIndex: config.seriesIndex, dataPointIndex: config.dataPointIndex })
}

function onMouseLeave() {
  emit('mouseleave')
}
</script>

<style lang="scss">
.track-view-stat {
  height: 42%;
  display: flex;
  flex-direction: column;

  .track-view-stat-header {
    padding: 0.5em;
    height: 40px;
    display: flex;
    align-items: baseline;

    & > h5 {
      margin-right: 0.5em;
    }
  }
  .track-view-stat-graph {
    flex-grow: 1;
  }
}
</style>
