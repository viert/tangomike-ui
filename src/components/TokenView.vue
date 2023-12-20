<template>
  <div class="token-view">
    <label class="token-view-label">API Token</label>
    <div class="token-view-field">**********</div>
    <button @click="copyToken" class="btn token-copy-button">
      <span class="material-symbols-outlined"> content_copy </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'

const store = useAuthStore()
const messages = useMessagesStore()
function copyToken() {
  navigator.clipboard.writeText(store.currentUser!.token)
  messages.info('Token copied to clipboard')
}
</script>

<style lang="scss">
.token-view {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 1.5em;
  font-size: 1em;

  .token-view-label {
    font-size: 0.8em;
    font-family: Montserrat, sans-serif;
    text-transform: uppercase;
    width: 100%;
  }

  .token-view-field {
    border: 1px solid #ccc;
    flex-grow: 1;
    font-size: 1.2em;
    line-height: 1.5em;
    padding: 9px;
    height: 40px;
  }

  .token-copy-button {
    transition: color 0.12s linear;
    color: #777;
    &:hover {
      color: black;
    }
  }
}
</style>
