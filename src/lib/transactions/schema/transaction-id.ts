import { z } from 'zod'

export const transactionIdSchema = z.uuidv4()

export type TransactionId = z.infer<typeof transactionIdSchema>
