import { buildApiAggregateError } from '../../shared/helpers'
import type { TokenObject } from '../../shared/schema'
import { transactionsClient } from '../client'
import type { Transaction } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  id: string
}

export async function retrieveTransaction(
  context: Context,
  params: Params,
): Promise<Transaction> {
  const {
    token: { token },
  } = context
  const { id } = params

  const retrieveTransactionResponse =
    await transactionsClient.retrieveTransaction({
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    })

  if (retrieveTransactionResponse.status !== 200) {
    throw buildApiAggregateError(
      retrieveTransactionResponse.body,
      `Failed to retrieve transaction with ID: ${id}`,
    )
  }

  return retrieveTransactionResponse.body.data
}
