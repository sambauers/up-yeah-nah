import { z } from 'zod'

export const tagIdSchema = z.string().min(1)

export type TagId = z.infer<typeof tagIdSchema>
