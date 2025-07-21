import { z } from 'zod'

export const api404ErrorResponseSchema = z.object({
  status: z.literal('404'),
  error: z.string(),
})

export type Api404ErrorResponse = z.infer<typeof api404ErrorResponseSchema>
