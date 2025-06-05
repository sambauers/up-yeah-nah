import { z } from 'zod/v4'

import { accountIdSchema } from '../../accounts/schema'
import { attachmentIdSchema } from '../../attachments/schema'
import { moneyObjectSchema, upApiUrlSchema } from '../../shared/schema'
import { transactionIdSchema } from './transaction-id'
import { transactionStatusSchema } from './transaction-status'

const holdInfoObjectSchema = z.object({
  amount: moneyObjectSchema,
  foreignAmount: moneyObjectSchema.nullable(),
})

const roundUpObjectSchema = z.object({
  amount: moneyObjectSchema,
  boostPortion: moneyObjectSchema.nullable(),
})

const cashbackObjectSchema = z.object({
  description: z.string(),
  amount: moneyObjectSchema,
})

const cardPurchaseMethodSchema = z.enum([
  'BAR_CODE',
  'OCR',
  'CARD_PIN',
  'CARD_DETAILS',
  'CARD_ON_FILE',
  'ECOMMERCE',
  'MAGNETIC_STRIPE',
  'CONTACTLESS',
])

const cardPurchaseMethodObjectSchema = z.object({
  method: cardPurchaseMethodSchema,
  cardNumberSuffix: z.string().nullable(),
})

const noteObjectSchema = z.object({
  text: z.string(),
})

const customerObjectSchema = z.object({
  displayName: z.string(),
})

const transactionAttributesSchema = z.object({
  status: transactionStatusSchema,
  rawText: z.string().nullable(),
  description: z.string(),
  message: z.string().nullable(),
  isCategorizable: z.boolean(),
  holdInfo: holdInfoObjectSchema.nullable(),
  roundUp: roundUpObjectSchema.nullable(),
  cashback: cashbackObjectSchema.nullable(),
  amount: moneyObjectSchema,
  foreignAmount: moneyObjectSchema.nullable(),
  cardPurchaseMethod: cardPurchaseMethodObjectSchema.nullable(),
  settledAt: z.iso.datetime({ offset: true }).nullable(),
  createdAt: z.iso.datetime({ offset: true }),
  transactionType: z.string(),
  note: noteObjectSchema.nullable(),
  performingCustomer: customerObjectSchema.nullable(),
  deepLinkURL: z.url({ protocol: /^up$/ }),
})

const transactionRelationshipsSchema = z.object({
  account: z.object({
    data: z.object({
      type: z.literal('accounts'),
      id: accountIdSchema,
    }),
    links: z
      .object({
        related: upApiUrlSchema,
      })
      .optional(),
  }),
  transferAccount: z.object({
    data: z
      .object({
        type: z.literal('accounts'),
        id: accountIdSchema,
      })
      .nullable(),
    links: z
      .object({
        related: upApiUrlSchema,
      })
      .optional(),
  }),
  category: z.object({
    data: z
      .object({
        type: z.literal('categories'),
        id: z.string(),
      })
      .nullable(),
    links: z
      .object({
        self: upApiUrlSchema,
        related: upApiUrlSchema.optional(),
      })
      .optional(),
  }),
  parentCategory: z.object({
    data: z
      .object({
        type: z.literal('categories'),
        id: z.string(),
      })
      .nullable(),
    links: z
      .object({
        related: upApiUrlSchema,
      })
      .optional(),
  }),
  tags: z.object({
    data: z.array(
      z.object({
        type: z.literal('tags'),
        id: z.string(),
      }),
    ),
    links: z
      .object({
        self: upApiUrlSchema,
      })
      .optional(),
  }),
  attachment: z.object({
    data: z
      .object({
        type: z.literal('attachments'),
        id: attachmentIdSchema,
      })
      .nullable(),
    links: z
      .object({
        related: upApiUrlSchema,
      })
      .optional(),
  }),
})

const transactionLinksSchema = z
  .object({
    self: upApiUrlSchema,
  })
  .optional()

export const transactionSchema = z.object({
  type: z.literal('transactions'),
  id: transactionIdSchema,
  attributes: transactionAttributesSchema,
  relationships: transactionRelationshipsSchema,
  links: transactionLinksSchema,
})

export type Transaction = z.infer<typeof transactionSchema>
