<template>
  <AuthenticatingView v-if="isAuthenticating" />
  <AuthenticationForm v-else-if="isNotLoggedIn" />
  <SignupView v-else-if="isSignup" />
  <MaintenanceView v-else-if="isMaintenance" />
  <RouterView v-else />
  <SideBar v-if="isActive">
    <NavBar></NavBar>
  </SideBar>
  <AlertBox />
</template>

<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import AuthenticatingView from '@/views/AuthenticatingView.vue'
import AuthenticationForm from '@/views/AuthenticationForm.vue'
import { RouterView } from 'vue-router'
import { useGlobalStore, AuthState } from './stores/global'
import { computed, onMounted } from 'vue'
import AlertBox from './components/AlertBox.vue'
import SignupView from './views/SignupView.vue'
import MaintenanceView from './views/MaintenanceView.vue'

const store = useGlobalStore()

const isAuthenticating = computed(() => store.authState === AuthState.Authenticating)
const isNotLoggedIn = computed(() => store.authState === AuthState.NotLoggedIn)
const isSignup = computed(() => store.authState === AuthState.Signup)
const isMaintenance = computed(() => store.authState === AuthState.Maintenance)
const isActive = computed(() => store.authState === AuthState.LoggedIn)
onMounted(async () => {
  await Promise.all([store.loadAppInfo(), store.loadAuth()])
})
</script>

<style lang="scss"></style>
./stores/global
