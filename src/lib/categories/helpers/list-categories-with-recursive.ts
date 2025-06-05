import { buildApiAggregateError } from '../../shared/helpers'
import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { categoriesClient } from '../client'
import type { CategoriesFilterQueryParams, Category } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  recursive?: boolean
  filter?: CategoriesFilterQueryParams
  page?: PaginationQueryParams
}

export async function listCategoriesWithRecursive(
  context: Context,
  params?: Params,
): Promise<Category[]> {
  const {
    token: { token },
  } = context

  const { recursive, filter, page } = params ?? {}

  const safeRecursive = typeof recursive === 'boolean' ? recursive : false

  const listCategoriesResponse = await categoriesClient.listCategories({
    headers: {
      authorization: `Bearer ${token}`,
    },
    query: {
      filter,
      page,
    },
  })

  if (listCategoriesResponse.status !== 200) {
    throw buildApiAggregateError(
      listCategoriesResponse.body,
      'Failed to fetch categories',
    )
  }

  const categories = listCategoriesResponse.body.data
  const pagination = listCategoriesResponse.body.links

  if (categories.length === 0) {
    // console.warn('No categories found.')
    return []
  }

  // console.log(`Found ${categories.length} categories.`)

  if (safeRecursive && pagination.next) {
    const nextUrl = new URL(pagination.next)
    const pageAfter = nextUrl.searchParams.get('page[after]')

    // Recursively fetch next page if available
    if (pageAfter) {
      // console.log(`Next page available: ${pageAfter}`)
      const nextCategories = await listCategoriesWithRecursive(context, {
        ...params,
        page: {
          ...page,
          after: pageAfter,
        },
      })
      categories.push(...nextCategories)
    }
  }

  return categories
}
