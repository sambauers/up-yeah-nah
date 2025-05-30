import { z } from 'zod'

export const paginationQueryParamsSchema = z
  .object({
    size: z.number().int().min(1).optional().default(100),
    before: z.string().optional(),
    after: z.string().optional(),
  })
  .optional()
  .default({ size: 100 })

export type PaginationQueryParams = z.infer<typeof paginationQueryParamsSchema>
