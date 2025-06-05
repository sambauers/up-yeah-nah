import { z } from 'zod/v4'

const apiErrorObjectSchema = z.object({
  status: z.string(),
  title: z.string(),
  detail: z.string(),
  source: z
    .object({
      parameter: z.string().optional(),
      pointer: z.string().optional(),
    })
    .optional(),
})

export const apiErrorResponseSchema = z.object({
  errors: z
    .union([apiErrorObjectSchema, z.array(apiErrorObjectSchema)])
    .transform((value) => (Array.isArray(value) ? value : [value])),
})

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>
