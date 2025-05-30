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
import { attachmentIdSchema, attachmentSchema } from './schema'

const attachmentsContract = initContract().router(
  {
    listAttachments: {
      method: 'GET',
      path: '/attachments',
      query: z.object({
        page: paginationQueryParamsSchema,
      }),
      responses: {
        200: z.object({
          data: z.array(attachmentSchema),
          links: paginationResponseSchema,
        }),
      },
      summary: 'List attachments',
    },
    retrieveAttachment: {
      method: 'GET',
      path: '/attachments/:id',
      pathParams: z.object({
        id: attachmentIdSchema,
      }),
      responses: {
        200: z.object({
          data: attachmentSchema,
        }),
      },
      summary: 'Retrieve attachment',
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

export const attachmentsClient = initClient(attachmentsContract, initClientArgs)
