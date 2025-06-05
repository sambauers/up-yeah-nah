import { z } from 'zod/v4'

export const transactionStatusSchema = z.enum(['HELD', 'SETTLED'])

export type TransactionStatus = z.infer<typeof transactionStatusSchema>
