import { z } from 'zod'

export const attachmentIdSchema = z.string().uuid()

export type AttachmentId = z.infer<typeof attachmentIdSchema>
