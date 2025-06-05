import { z } from 'zod/v4'

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
