import { z } from 'zod/v4'

export const transactionIdSchema = z.uuidv4()

export type TransactionId = z.infer<typeof transactionIdSchema>
