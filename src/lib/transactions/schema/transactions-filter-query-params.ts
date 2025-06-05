import { Temporal } from 'temporal-polyfill'
import { z } from 'zod/v4'

import { transactionStatusSchema } from './transaction-status'

function isIsoDate(maybe: string): boolean {
  return z.iso.date().safeParse(maybe).success
}

function isIsoDateTime(maybe: string): boolean {
  return z.iso.datetime().safeParse(maybe).success
}

function stripTimezone(isoDateTime: string): string {
  return isoDateTime.replace(/\[.+\/.+\]$/, '')
}

function transformDate(
  value: string | undefined,
  time: string,
): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const safeTime = z.iso.time().catch('00:00:00').parse(time)

  if (isIsoDate(value)) {
    return stripTimezone(
      Temporal.ZonedDateTime.from(
        `${value}T${safeTime}[Australia/Sydney]`,
      ).toString(),
    )
  }

  if (isIsoDateTime(value)) {
    return stripTimezone(
      Temporal.ZonedDateTime.from(`${value}[Australia/Sydney]`).toString(),
    )
  }

  return undefined
}

export const transactionsFilterQueryParamsSchema = z
  .object({
    status: transactionStatusSchema.optional(),
    since: z
      .string()
      .optional()
      .overwrite((value) => transformDate(value, '00:00:00')),
    until: z
      .string()
      .optional()
      .overwrite((value) => transformDate(value, '23:59:59')),
    category: z.string().optional(),
    tag: z.string().optional(),
  })
  .optional()

export type TransactionsFilterQueryParams = z.infer<
  typeof transactionsFilterQueryParamsSchema
>
