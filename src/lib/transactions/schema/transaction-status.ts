import { z } from 'zod'

export const transactionStatusSchema = z.enum(['HELD', 'SETTLED'])

export type TransactionStatus = z.infer<typeof transactionStatusSchema>
