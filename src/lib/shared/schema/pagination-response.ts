import { z } from 'zod/v4'

import { upApiUrlSchema } from './up-api-url'

export const paginationResponseSchema = z.object({
  prev: upApiUrlSchema.nullable(),
  next: upApiUrlSchema.nullable(),
})

export type PaginationResponse = z.infer<typeof paginationResponseSchema>
