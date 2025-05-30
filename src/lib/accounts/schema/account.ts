import { z } from 'zod'

import { moneyObjectSchema } from '../../shared/schema'
import { accountIdSchema } from './account-id'
import { accountTypeSchema } from './account-type'
import { ownershipTypeSchema } from './ownership-type'

const accountAttributesSchema = z.object({
  displayName: z.string(),
  accountType: accountTypeSchema,
  ownershipType: ownershipTypeSchema,
  balance: moneyObjectSchema,
  createdAt: z.string().datetime({ offset: true }),
})

const accountRelationshipsSchema = z.object({
  transactions: z.object({
    links: z
      .object({
        related: z.string().url(),
      })
      .optional(),
  }),
})

const accountLinksSchema = z
  .object({
    self: z.string().url(),
  })
  .optional()

export const accountSchema = z.object({
  type: z.literal('accounts'),
  id: accountIdSchema,
  attributes: accountAttributesSchema,
  relationships: accountRelationshipsSchema,
  links: accountLinksSchema,
})

export type Account = z.infer<typeof accountSchema>
