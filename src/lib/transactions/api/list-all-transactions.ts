import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { listTransactionsWithRecursive } from '../helpers'
import type { Transaction, TransactionsFilterQueryParams } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  filter?: TransactionsFilterQueryParams
  page?: PaginationQueryParams
}

export async function listAllTransactions(
  context: Context,
  params?: Params,
): Promise<Transaction[]> {
  return listTransactionsWithRecursive(context, {
    ...params,
    recursive: true,
  })
}
