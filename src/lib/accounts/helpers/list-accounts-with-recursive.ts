import { buildApiAggregateError } from '../../shared/helpers'
import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { accountsClient } from '../client'
import type { Account, AccountsFilterQueryParams } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  recursive?: boolean
  filter?: AccountsFilterQueryParams
  page?: PaginationQueryParams
}

export async function listAccountsWithRecursive(
  context: Context,
  params?: Params,
): Promise<Account[]> {
  const {
    token: { token },
  } = context

  const { recursive, filter, page } = params ?? {}

  const safeRecursive = typeof recursive === 'boolean' ? recursive : false

  const listAccountsResponse = await accountsClient.listAccounts({
    headers: {
      authorization: `Bearer ${token}`,
    },
    query: {
      filter,
      page,
    },
  })

  if (listAccountsResponse.status !== 200) {
    throw buildApiAggregateError(
      listAccountsResponse.body,
      'Failed to fetch accounts',
    )
  }

  const accounts = listAccountsResponse.body.data
  const pagination = listAccountsResponse.body.links

  if (accounts.length === 0) {
    // console.warn(`No accounts found for id: ${token.id}`)
    return []
  }

  // console.log(`Found ${accounts.length.toString()} accounts for owner: ${owner}`)

  if (safeRecursive && pagination.next) {
    const nextUrl = new URL(pagination.next)
    const pageAfter = nextUrl.searchParams.get('page[after]')

    // Recursively fetch next page if available
    if (pageAfter) {
      // console.log(`Next page available: ${pageAfter}`)
      const nextAccounts = await listAccountsWithRecursive(context, {
        ...params,
        page: {
          ...page,
          after: pageAfter,
        },
      })
      accounts.push(...nextAccounts)
    }
  }

  return accounts
}
