import Axios from 'axios'
import { wrap } from './wrap'
import type { AppInfo } from './types'

export const app = {
  async info() {
    return wrap<AppInfo>(Axios.get('/api/v1/app/info'))
  }
}
