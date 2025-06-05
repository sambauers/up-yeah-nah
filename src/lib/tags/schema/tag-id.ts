import { z } from 'zod/v4'

export const tagIdSchema = z.string().min(1)

export type TagId = z.infer<typeof tagIdSchema>
