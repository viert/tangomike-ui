<template>
  <div class="btn-group">
    <button
      v-for="option in options"
      :key="option"
      class="btn btn-sm"
      :class="{
        'btn-outline-secondary': modelValue !== option,
        'btn-primary': modelValue === option
      }"
      @click.prevent="onClick(option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ options: string[]; modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function onClick(option: string) {
  emit('update:modelValue', option)
}
</script>

<style lang="scss"></style>
