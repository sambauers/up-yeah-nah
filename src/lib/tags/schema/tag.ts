import { z } from 'zod'

import { upApiUrlSchema } from '../../shared/schema'
import { tagIdSchema } from './tag-id'

const tagRelationshipsSchema = z.object({
  transactions: z.object({
    links: z
      .object({
        related: upApiUrlSchema,
      })
      .optional(),
  }),
})

export const tagSchema = z.object({
  type: z.literal('tags'),
  id: tagIdSchema,
  relationships: tagRelationshipsSchema,
})

export type Tag = z.infer<typeof tagSchema>
