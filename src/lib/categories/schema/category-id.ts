import { z } from 'zod/v4'

export const categoryIdSchema = z.string().min(1)

export type CategoryId = z.infer<typeof categoryIdSchema>
