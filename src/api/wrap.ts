import { AuthState, useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import type { AxiosError, AxiosResponse } from 'axios'

export function wrap<T>(response: Promise<AxiosResponse>, catch401 = false): Promise<T | null> {
  const authStore = useAuthStore()
  const msgStore = useMessagesStore()
  return response
    .then((resp) => {
      return resp.data as T
    })
    .catch((err: AxiosError) => {
      if (err.response) {
        if (err.response.status === 401) {
          authStore.setAuthState(AuthState.NotLoggedIn)
          if (catch401) {
            return null
          }
        }
        if (err.response.data) {
          const data = err.response.data as { error?: string }
          if (data.error) {
            msgStore.error(data.error)
          }
        } else {
          msgStore.error(`server error, status_code=${err.response.status}`)
        }
      } else {
        msgStore.error(`fatal ${err}`)
      }
      return null
    })
}
