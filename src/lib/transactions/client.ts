import { initClient, initContract } from '@ts-rest/core'
import { z } from 'zod/v4'

import { accountIdSchema } from '../accounts/schema'
import {
  api404ErrorResponseSchema,
  apiErrorResponseSchema,
  bearerSchema,
  paginationQueryParamsSchema,
  paginationResponseSchema,
} from '../shared/schema'
import { initClientArgs } from '../shared/ts-rest'
import {
  transactionIdSchema,
  transactionSchema,
  transactionsFilterQueryParamsSchema,
} from './schema'

const transactionsContract = initContract().router(
  {
    listTransactions: {
      method: 'GET',
      path: '/transactions',
      query: z.object({
        filter: transactionsFilterQueryParamsSchema,
        page: paginationQueryParamsSchema,
      }),
      responses: {
        200: z.object({
          data: z.array(transactionSchema),
          links: paginationResponseSchema,
        }),
      },
      summary: 'List transactions',
    },
    listTransactionsByAccount: {
      method: 'GET',
      path: '/accounts/:accountId/transactions',
      pathParams: z.object({
        accountId: accountIdSchema,
      }),
      query: z.object({
        filter: transactionsFilterQueryParamsSchema,
        page: paginationQueryParamsSchema,
      }),
      responses: {
        200: z.object({
          data: z.array(transactionSchema),
          links: paginationResponseSchema,
        }),
      },
      summary: 'List transactions by account',
    },
    retrieveTransaction: {
      method: 'GET',
      path: '/transactions/:id',
      pathParams: z.object({
        id: transactionIdSchema,
      }),
      responses: {
        200: z.object({
          data: transactionSchema,
        }),
      },
      summary: 'Retrieve transaction',
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

export const transactionsClient = initClient(
  transactionsContract,
  initClientArgs,
)
