import { initClient, initContract } from '@ts-rest/core'
import { z } from 'zod'

import {
  api404ErrorResponseSchema,
  apiErrorResponseSchema,
  bearerSchema,
  paginationQueryParamsSchema,
  paginationResponseSchema,
} from '../shared/schema'
import { initClientArgs } from '../shared/ts-rest'
import {
  accountIdSchema,
  accountSchema,
  accountsFilterQueryParamsSchema,
} from './schema'

const accountsContract = initContract().router(
  {
    listAccounts: {
      method: 'GET',
      path: '/accounts',
      query: z.object({
        filter: accountsFilterQueryParamsSchema,
        page: paginationQueryParamsSchema,
      }),
      responses: {
        200: z.object({
          data: z.array(accountSchema),
          links: paginationResponseSchema,
        }),
      },
      summary: 'List accounts',
    },
    retrieveAccount: {
      method: 'GET',
      path: '/accounts/:id',
      pathParams: z.object({
        id: accountIdSchema,
      }),
      responses: {
        200: z.object({
          data: accountSchema,
        }),
      },
      summary: 'Retrieve account',
    },
  },
  {
    baseHeaders: z.object({
      authorization: bearerSchema,
    }),
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

export const accountsClient = initClient(accountsContract, initClientArgs)
