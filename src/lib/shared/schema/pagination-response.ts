import { z } from 'zod'

export const paginationResponseSchema = z.object({
  prev: z.string().url().nullable(),
  next: z.string().url().nullable(),
})

export type PaginationResponse = z.infer<typeof paginationResponseSchema>
