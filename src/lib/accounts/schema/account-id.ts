import { z } from 'zod'

export const accountIdSchema = z.uuidv4()

export type AccountId = z.infer<typeof accountIdSchema>
