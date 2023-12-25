<template>
  <div class="alert-box">
    <div v-for="msg in store.messages" :key="msg.id" class="alert" :class="msg.extraClasses">
      {{ msg.text }}
      <a @click.prevent="store.removeMessage(msg.id)" href="#" class="close">
        <span class="material-symbols-outlined"> close </span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessagesStore } from '@/stores/messages'

const store = useMessagesStore()
</script>

<style lang="scss">
.alert-box {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;

  .alert {
    margin-bottom: 0.5em;
    position: relative;
    .close {
      position: absolute;
      top: 14px;
      right: 10px;
    }
  }
}
</style>
