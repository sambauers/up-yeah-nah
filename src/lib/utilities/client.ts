import { initClient, initContract } from '@ts-rest/core'
import { z } from 'zod'

import {
  api404ErrorResponseSchema,
  apiErrorResponseSchema,
  bearerSchema,
} from '../shared/schema'
import { initClientArgs } from '../shared/ts-rest'
import { pingMetaSchema } from './schema'

const utilitiesContract = initContract().router(
  {
    ping: {
      method: 'GET',
      path: '/util/ping',
      responses: {
        200: z.object({
          meta: pingMetaSchema,
        }),
      },
      summary: 'Ping',
    },
  },
  {
    baseHeaders: {
      authorization: bearerSchema,
    },
    commonResponses: {
      400: apiErrorResponseSchema,
      401: apiErrorResponseSchema,
      404: api404ErrorResponseSchema,
      422: apiErrorResponseSchema,
      429: apiErrorResponseSchema,
      500: apiErrorResponseSchema,
      502: apiErrorResponseSchema,
      503: apiErrorResponseSchema,
      504: apiErrorResponseSchema,
    },
    strictStatusCodes: true,
  },
)

export const utilitiesClient = initClient(utilitiesContract, initClientArgs)
