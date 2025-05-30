import { buildApiAggregateError } from '../../shared/helpers'
import type { TokenObject } from '../../shared/schema'
import { accountsClient } from '../client'
import type { Account } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  id: string
}

export async function retrieveAccount(
  context: Context,
  params: Params,
): Promise<Account> {
  const {
    token: { token },
  } = context

  const { id } = params

  const retrieveAccountResponse = await accountsClient.retrieveAccount({
    headers: {
      authorization: `Bearer ${token}`,
    },
    params: {
      id,
    },
  })

  if (retrieveAccountResponse.status !== 200) {
    throw buildApiAggregateError(
      retrieveAccountResponse.body,
      `Failed to retrieve account with ID: ${id}`,
    )
  }

  return retrieveAccountResponse.body.data
}
