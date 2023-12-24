<template>
  <RouterLink :to="flightLink" class="track-list-item">
    <h4>{{ departure }} - {{ arrival }}</h4>
    <div class="info">
      <b>{{ flight.callsign }}</b> {{ flight.aircraft }} by {{ name }} {{ datetime }}
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Flight } from '@/api/types'
import { computed } from 'vue'
const props = defineProps<{ flight: Flight }>()

const departure = computed(() => props.flight.departure || '...')
const arrival = computed(() => props.flight.arrival || '...')
const name = computed(() => {
  if (!props.flight.user) return 'unknown user'
  let name = props.flight.user.first_name
  if (name !== '') name += ' '
  name += props.flight.user.last_name

  const nameEmpty = name === ''
  if (!nameEmpty) name += ' ('
  name += props.flight.user.username
  if (!nameEmpty) name += ')'
  return name
})
const datetime = computed(() => {
  const dt = new Date(props.flight.created_at)
  return `${dt.toLocaleString()}`
})
const flightLink = computed(() => {
  return `/tracks/${props.flight.flight_id}`
})
</script>

<style lang="scss">
a.track-list-item {
  text-decoration: none;
  color: black;
  width: 100%;
  margin-bottom: 0.5em;
  border-bottom: 1px solid #eee;
  padding: 8px;

  &:hover {
    background-color: #f0f0f0;
  }
}
</style>
