import { buildApiAggregateError } from '../../shared/helpers'
import type { TokenObject } from '../../shared/schema'
import { categoriesClient } from '../client'
import type { Category } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  id: string
}

export async function retrieveCategory(
  context: Context,
  params: Params,
): Promise<Category> {
  const {
    token: { token },
  } = context
  const { id } = params

  const retrieveCategoryResponse = await categoriesClient.retrieveCategory({
    headers: {
      authorization: `Bearer ${token}`,
    },
    params,
  })

  if (retrieveCategoryResponse.status !== 200) {
    throw buildApiAggregateError(
      retrieveCategoryResponse.body,
      `Failed to retrieve category with ID: ${id}`,
    )
  }

  return retrieveCategoryResponse.body.data
}
