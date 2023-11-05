<template>
  <AuthenticatingView v-if="isAuthenticating" />
  <AuthenticationForm v-else-if="isNotLoggedIn" />
  <SignupView v-else-if="isSignup" />
  <RouterView v-else />
  <AlertBox />
</template>

<script setup lang="ts">
import AuthenticatingView from '@/views/AuthenticatingView.vue'
import AuthenticationForm from '@/views/AuthenticationForm.vue'
import { RouterView } from 'vue-router'
import { useAuthStore, AuthState } from './stores/auth'
import { computed, onMounted } from 'vue'
import AlertBox from './components/AlertBox.vue'
import SignupView from './views/SignupView.vue'

const store = useAuthStore()

const isAuthenticating = computed(() => store.authState === AuthState.Authenticating)
const isNotLoggedIn = computed(() => store.authState === AuthState.NotLoggedIn)
const isSignup = computed(() => store.authState === AuthState.Signup)
onMounted(async () => {
  await store.loadAuth()
})
</script>

<style lang="scss"></style>
