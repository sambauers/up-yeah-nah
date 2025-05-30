import { z } from 'zod'

import { accountTypeSchema } from './account-type'
import { ownershipTypeSchema } from './ownership-type'

export const accountsFilterQueryParamsSchema = z
  .object({
    accountType: accountTypeSchema.optional(),
    ownershipType: ownershipTypeSchema.optional(),
  })
  .optional()

export type AccountsFilterQueryParams = z.infer<
  typeof accountsFilterQueryParamsSchema
>
