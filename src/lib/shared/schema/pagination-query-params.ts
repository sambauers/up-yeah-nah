import { z } from 'zod'

export const paginationQueryParamsSchema = z
  .object({
    size: z.number().int().min(1).prefault(100).optional(),
    before: z.string().optional(),
    after: z.string().optional(),
  })
  .prefault({ size: 100 })
  .optional()

export type PaginationQueryParams = z.infer<typeof paginationQueryParamsSchema>
