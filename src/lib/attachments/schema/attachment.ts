import { z } from 'zod'

import { transactionIdSchema } from '../../transactions/schema'
import { attachmentIdSchema } from './attachment-id'

const attachmentAttributesSchema = z.object({
  createdAt: z.string().datetime({ offset: true }).nullable(),
  fileURL: z.string().url().nullable(),
  fileURLExpiresAt: z.string().datetime({ offset: true }),
  fileExtension: z.string().nullable(),
  fileContentType: z.string().nullable(),
})

const attachmentRelationshipsSchema = z.object({
  transaction: z.object({
    data: z.object({
      type: z.literal('transactions'),
      id: transactionIdSchema,
    }),
    links: z
      .object({
        related: z.string().url(),
      })
      .optional(),
  }),
})

const attachmentLinksSchema = z
  .object({
    self: z.string().url(),
  })
  .optional()

export const attachmentSchema = z.object({
  type: z.literal('attachments'),
  id: attachmentIdSchema,
  attributes: attachmentAttributesSchema,
  relationships: attachmentRelationshipsSchema,
  links: attachmentLinksSchema,
})

export type Attachment = z.infer<typeof attachmentSchema>
