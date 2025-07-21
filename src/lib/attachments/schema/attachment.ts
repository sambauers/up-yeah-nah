import { z } from 'zod'

import { upApiUrlSchema } from '../../shared/schema'
import { transactionIdSchema } from '../../transactions/schema'
import { attachmentIdSchema } from './attachment-id'

const attachmentAttributesSchema = z.object({
  createdAt: z.iso.datetime({ offset: true }).nullable(),
  fileURL: z.url().nullable(),
  fileURLExpiresAt: z.iso.datetime({ offset: true }),
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
        related: upApiUrlSchema,
      })
      .optional(),
  }),
})

const attachmentLinksSchema = z
  .object({
    self: upApiUrlSchema,
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
