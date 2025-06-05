import { z } from 'zod/v4'

export const api404ErrorResponseSchema = z.object({
  status: z.literal('404'),
  error: z.string(),
})

export type Api404ErrorResponse = z.infer<typeof api404ErrorResponseSchema>
