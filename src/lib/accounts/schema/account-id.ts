import { z } from 'zod/v4'

export const accountIdSchema = z.uuidv4()

export type AccountId = z.infer<typeof accountIdSchema>
