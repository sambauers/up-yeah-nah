import { z } from 'zod'

export const accountIdSchema = z.string().uuid()

export type AccountId = z.infer<typeof accountIdSchema>
