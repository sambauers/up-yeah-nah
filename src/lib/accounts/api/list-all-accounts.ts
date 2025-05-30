import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { listAccountsWithRecursive } from '../helpers'
import type { Account, AccountsFilterQueryParams } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  filter?: AccountsFilterQueryParams
  page?: PaginationQueryParams
}

export async function listAllAccounts(
  context: Context,
  params?: Params,
): Promise<Account[]> {
  return listAccountsWithRecursive(context, {
    ...params,
    recursive: true,
  })
}
