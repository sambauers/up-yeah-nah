import { z } from 'zod'

export const attachmentIdSchema = z.uuidv4()

export type AttachmentId = z.infer<typeof attachmentIdSchema>
