import { z } from 'zod/v4'

export const attachmentIdSchema = z.uuidv4()

export type AttachmentId = z.infer<typeof attachmentIdSchema>
