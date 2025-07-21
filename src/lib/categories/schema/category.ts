import { z } from 'zod'

import { upApiUrlSchema } from '../../shared/schema'
import { categoryIdSchema } from './category-id'

const categoryAttributesSchema = z.object({
  name: z.string(),
})

const categoryRelationshipsSchema = z.object({
  parent: z.object({
    data: z
      .object({
        type: z.literal('categories'),
        id: categoryIdSchema,
      })
      .nullable(),
    links: z
      .object({
        related: upApiUrlSchema,
      })
      .optional(),
  }),
  children: z.object({
    data: z.array(
      z.object({
        type: z.literal('categories'),
        id: categoryIdSchema,
      }),
    ),
    links: z
      .object({
        related: upApiUrlSchema,
      })
      .optional(),
  }),
})

const categoryLinksSchema = z
  .object({
    self: upApiUrlSchema,
  })
  .optional()

export const categorySchema = z.object({
  type: z.literal('categories'),
  id: categoryIdSchema,
  attributes: categoryAttributesSchema,
  relationships: categoryRelationshipsSchema,
  links: categoryLinksSchema,
})

export type Category = z.infer<typeof categorySchema>
