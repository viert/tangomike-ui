import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { AppInfo, User } from '@/api/types'
import api from '@/api'

export enum AuthState {
  LoggedIn,
  NotLoggedIn,
  Authenticating,
  Signup,
  Maintenance
}

export const useGlobalStore = defineStore('global', () => {
  const currentUser: Ref<User | null> = ref(null)
  const authState: Ref<AuthState> = ref(AuthState.Authenticating)
  const appInfo: Ref<AppInfo | null> = ref(null)

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

  return {
    currentUser,
    authState,
    appInfo,
    loadAppInfo,
    loadAuth,
    setAuthState,
    authenticate,
    signup,
    logout
  }
})
