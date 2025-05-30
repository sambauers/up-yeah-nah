import { z } from 'zod'

export const categoryIdSchema = z.string().min(1)

export type CategoryId = z.infer<typeof categoryIdSchema>
