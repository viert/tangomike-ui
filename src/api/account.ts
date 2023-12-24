import Axios from 'axios'
import type { AccountResponse, StatusResponse } from './types'
import { wrap } from './wrap'

export const account = {
  async me(catch401 = true) {
    return wrap<AccountResponse>(Axios.get('/api/v1/account/me'), catch401)
  },

  async authenticate(username: string, password: string) {
    const payload = { username, password }
    return wrap<StatusResponse<AccountResponse>>(
      Axios.post('/api/v1/account/authenticate', payload)
    )
  },

  async signup(
    username: string,
    password: string,
    passwordConfirm: string,
    firstName: string,
    lastName: string,
    email: string
  ) {
    const payload = {
      username,
      password,
      password_confirm: passwordConfirm,
      first_name: firstName,
      last_name: lastName,
      email
    }
    return wrap<AccountResponse>(Axios.post('/api/v1/account/signup', payload))
  },

  async logout() {
    return wrap(Axios.post('/api/v1/account/logout'))
  }
}
