import { z } from 'zod/v4'

export const accountTypeSchema = z.enum(['SAVER', 'TRANSACTIONAL', 'HOME_LOAN'])

export type AccountType = z.infer<typeof accountTypeSchema>
