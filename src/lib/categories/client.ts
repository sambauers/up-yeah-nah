import { initClient, initContract } from '@ts-rest/core'
import { z } from 'zod/v4'

import {
  api404ErrorResponseSchema,
  apiErrorResponseSchema,
  bearerSchema,
  paginationQueryParamsSchema,
  paginationResponseSchema,
} from '../shared/schema'
import { initClientArgs } from '../shared/ts-rest'
import { transactionIdSchema } from '../transactions/schema'
import {
  categoriesFilterQueryParamsSchema,
  categoryIdSchema,
  categorySchema,
} from './schema'

const categoriesContract = initContract().router(
  {
    listCategories: {
      method: 'GET',
      path: '/categories',
      query: z.object({
        filter: categoriesFilterQueryParamsSchema,
        page: paginationQueryParamsSchema,
      }),
      responses: {
        200: z.object({
          data: z.array(categorySchema),
          links: paginationResponseSchema,
        }),
      },
      summary: 'List categories',
    },
    retrieveCategory: {
      method: 'GET',
      path: '/categories/:id',
      pathParams: z.object({
        id: categoryIdSchema,
      }),
      responses: {
        200: z.object({
          data: categorySchema,
        }),
      },
      summary: 'Retrieve category',
    },
    categorizeTransaction: {
      method: 'PATCH',
      path: '/transactions/:transactionId/relationships/category',
      pathParams: z.object({
        transactionId: transactionIdSchema,
      }),
      body: z.object({
        data: z
          .object({
            type: z.literal('categories'),
            id: categoryIdSchema,
          })
          .nullable(),
      }),
      responses: {
        204: z.void(),
      },
      summary: 'Categorize transaction',
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

export const categoriesClient = initClient(categoriesContract, initClientArgs)
