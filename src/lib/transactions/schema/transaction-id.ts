import { z } from 'zod'

export const transactionIdSchema = z.string().uuid()

export type TransactionId = z.infer<typeof transactionIdSchema>
