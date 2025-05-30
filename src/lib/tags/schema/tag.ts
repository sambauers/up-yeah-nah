import { z } from 'zod'

import { tagIdSchema } from './tag-id'

const tagRelationshipsSchema = z.object({
  transactions: z.object({
    links: z
      .object({
        related: z.string().url(),
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
