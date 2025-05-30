import { InitClientArgs } from '@ts-rest/core'

import { API_BASE_URL } from '../constants'
import { restFetchApi } from './rest-fetch-api'

export const initClientArgs: InitClientArgs = {
  baseUrl: API_BASE_URL,
  baseHeaders: {
    accept: 'application/json',
    contentType: 'application/json',
  },
  throwOnUnknownStatus: true,
  validateResponse: true,
  api: (args) => restFetchApi({ ...args, baseUrl: API_BASE_URL }),
}
