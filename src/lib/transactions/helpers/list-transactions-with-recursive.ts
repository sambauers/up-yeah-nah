import { buildApiAggregateError } from '../../shared/helpers'
import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { transactionsClient } from '../client'
import type { Transaction, TransactionsFilterQueryParams } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  recursive?: boolean
  accountId?: string
  filter?: TransactionsFilterQueryParams
  page?: PaginationQueryParams
}

export async function listTransactionsWithRecursive(
  context: Context,
  params?: Params,
): Promise<Transaction[]> {
  const {
    token: { token },
  } = context

  const { recursive, accountId, filter, page } = params ?? {}

  const safeRecursive = typeof recursive === 'boolean' ? recursive : false

  const listTransactionsResponse = accountId
    ? await transactionsClient.listTransactionsByAccount({
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          accountId,
        },
        query: {
          filter,
          page,
        },
      })
    : await transactionsClient.listTransactions({
        headers: {
          authorization: `Bearer ${token}`,
        },
        query: {
          filter,
          page,
        },
      })

  if (listTransactionsResponse.status !== 200) {
    throw buildApiAggregateError(
      listTransactionsResponse.body,
      'Failed to fetch transactions',
    )
  }

  const transactions = listTransactionsResponse.body.data
  const pagination = listTransactionsResponse.body.links

  if (transactions.length === 0) {
    // console.warn('No transactions found.')
    return []
  }

  // console.log(`Found ${transactions.length} transactions.`)

  if (safeRecursive && pagination.next) {
    const nextUrl = new URL(pagination.next)
    const pageAfter = nextUrl.searchParams.get('page[after]')

    // Recursively fetch next page if available
    if (pageAfter) {
      // console.log(`Next page available: ${pageAfter}`)
      const nextTransactions = await listTransactionsWithRecursive(context, {
        ...params,
        page: {
          ...page,
          after: pageAfter,
        },
      })
      transactions.push(...nextTransactions)
    }
  }

  return transactions
}
