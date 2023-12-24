import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { AccountResponse, AppInfo, User } from '@/api/types'
import api from '@/api'

export enum AuthState {
  LoggedIn,
  NotLoggedIn,
  Authenticating,
  Signup,
  Maintenance
}

export const useGlobalStore = defineStore('global', () => {
  const currentUser: Ref<AccountResponse | null> = ref(null)
  const authState: Ref<AuthState> = ref(AuthState.Authenticating)
  const appInfo: Ref<AppInfo | null> = ref(null)
  const menuOpen = ref(false)

  async function loadAuth() {
    const user = await api.account.me(true)
    if (user) {
      currentUser.value = user
      authState.value = AuthState.LoggedIn
    }
  }

  async function loadAppInfo() {
    if (appInfo.value === null) {
      appInfo.value = await api.app.info()
    }
  }

  async function authenticate(username: string, password: string) {
    const resp = await api.account.authenticate(username, password)
    if (resp) {
      currentUser.value = resp.data
      authState.value = AuthState.LoggedIn
      return resp.data
    }
    return null
  }

  async function signup(
    username: string,
    password: string,
    passwordConfirm: string,
    firstName: string,
    lastName: string,
    email: string
  ) {
    const user = await api.account.signup(
      username,
      password,
      passwordConfirm,
      firstName,
      lastName,
      email
    )
    if (user) {
      authState.value = AuthState.NotLoggedIn
    }
    return user
  }

  function setAuthState(newState: AuthState) {
    authState.value = newState
    if (newState === AuthState.NotLoggedIn) {
      currentUser.value = null
    }
  }

  async function logout() {
    await api.account.logout()
    authState.value = AuthState.NotLoggedIn
    currentUser.value = null
  }

  function openMenu() {
    menuOpen.value = true
  }

  function closeMenu() {
    menuOpen.value = false
  }

  function toggleMenu() {
    menuOpen.value = !menuOpen.value
  }

  return {
    currentUser,
    authState,
    appInfo,
    menuOpen,
    loadAppInfo,
    loadAuth,
    setAuthState,
    authenticate,
    signup,
    logout,
    openMenu,
    closeMenu,
    toggleMenu
  }
})
