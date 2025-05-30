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
import { transactionIdSchema } from '../transactions/schema'
import { tagIdSchema, tagSchema } from './schema'

const tagsContract = initContract().router(
  {
    listTags: {
      method: 'GET',
      path: '/tags',
      query: z.object({
        page: paginationQueryParamsSchema,
      }),
      responses: {
        200: z.object({
          data: z.array(tagSchema),
          links: paginationResponseSchema,
        }),
      },
      summary: 'List tags',
    },
    addTagsToTransaction: {
      method: 'POST',
      path: '/transactions/:transactionId/relationships/tags',
      pathParams: z.object({
        transactionId: transactionIdSchema,
      }),
      body: z.object({
        data: z.array(
          z.object({
            type: z.literal('tags'),
            id: tagIdSchema,
          }),
        ),
      }),
      responses: {
        204: z.void(),
      },
      summary: 'Add tags to transaction',
    },
    removeTagsFromTransaction: {
      method: 'DELETE',
      path: '/transactions/:transactionId/relationships/tags',
      pathParams: z.object({
        transactionId: transactionIdSchema,
      }),
      body: z.object({
        data: z.array(
          z.object({
            type: z.literal('tags'),
            id: tagIdSchema,
          }),
        ),
      }),
      responses: {
        204: z.void(),
      },
      summary: 'Remove tags from transaction',
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

export const tagsClient = initClient(tagsContract, initClientArgs)
