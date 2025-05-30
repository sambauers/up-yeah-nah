import { TokenObject } from '../../shared/schema'
import { categoriesClient } from '../client'

interface Context {
  token: TokenObject
}

interface Params {
  transactionId: string
  categoryId: string | null
}

export async function categorizeTransaction(context: Context, params: Params) {
  const {
    token: { token },
  } = context
  const { transactionId, categoryId } = params

  return categoriesClient.categorizeTransaction({
    headers: {
      authorization: `Bearer ${token}`,
    },
    params: {
      transactionId,
    },
    body: {
      data:
        categoryId === null
          ? null
          : {
              type: 'categories',
              id: categoryId,
            },
    },
  })
}
