<template>
  <div class="track-list-page">
    <header>
      <h4>Track list</h4>
    </header>
    <div class="track-list-filter">
      <ButtonSwitch :options="['mine', 'all']" v-model="mineOption" />
      <ButtonSwitch :options="['active', 'all']" v-model="activeOption" />
    </div>
    <div class="track-list"></div>
  </div>
</template>

<script setup lang="ts">
import { useTrackStore } from '@/stores/tracks'
import { onMounted, ref } from 'vue'
import { useQuery, Convert } from '@/lib/query'
import ButtonSwitch from '@/components/ButtonSwitch.vue'

const store = useTrackStore()
const mineOption = ref('mine')
const activeOption = ref('active')
const { value: page, setValue: setPage } = useQuery('page', Convert.INT)
const { value: mine, setValue: setMine } = useQuery('mine', Convert.BOOL)
const { value: active, setValue: setActive } = useQuery('mine', Convert.BOOL)
</script>

<style scoped></style>
