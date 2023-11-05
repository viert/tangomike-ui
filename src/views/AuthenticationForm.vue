<template>
  <div class="whole-damn-page">
    <form @submit.prevent="onSubmit" class="authentication-form">
      <h4>Track My Flight</h4>
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="username" type="text" class="form-control" id="username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" class="form-control" id="password" />
      </div>
      <div class="change-mode">
        Not a member? <a href="#" @click.prevent="changeMode">Sign up</a>
      </div>
      <div class="form-buttons">
        <button type="submit" class="btn btn-primary">Sign in</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore, AuthState } from '@/stores/auth'
import { ref } from 'vue'

const store = useAuthStore()
const username = ref('')
const password = ref('')

async function onSubmit() {
  const user = await store.authenticate(username.value, password.value)
  if (!user) {
    password.value = ''
  }
}

function changeMode() {
  store.setAuthState(AuthState.Signup)
}
</script>

<style lang="scss">
@use '@/assets/mixins.scss';

.authentication-form {
  @extend %center-form;
  top: calc(50% - 120px);
  left: calc(50% - 180px);
  width: 360px;
  height: 240px;
  padding: 12px;
}
</style>
