import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/api/types'
import api from '@/api'

export enum AuthState {
  LoggedIn,
  NotLoggedIn,
  Authenticating,
  Signup,
  Maintenance
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser: Ref<User | null> = ref(null)
  const authState: Ref<AuthState> = ref(AuthState.Authenticating)

  async function loadAuth() {
    const user = await api.account.me(true)
    if (user) {
      currentUser.value = user
      authState.value = AuthState.LoggedIn
    }
  }

  async function authenticate(username: string, password: string) {
    const user = await api.account.authenticate(username, password)
    if (user) {
      currentUser.value = user
      authState.value = AuthState.LoggedIn
    }
    return user
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

  return { currentUser, authState, loadAuth, setAuthState, authenticate, signup, logout }
})
