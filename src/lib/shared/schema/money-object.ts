import { z } from 'zod/v4'

export const moneyObjectSchema = z.object({
  currencyCode: z.string().length(3),
  value: z.string().regex(/^-?\d+\.\d{2,2}$/),
  valueInBaseUnits: z.int(),
})
