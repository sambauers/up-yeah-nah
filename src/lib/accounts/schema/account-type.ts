import { z } from 'zod'

export const accountTypeSchema = z.enum(['SAVER', 'TRANSACTIONAL', 'HOME_LOAN'])

export type AccountType = z.infer<typeof accountTypeSchema>
