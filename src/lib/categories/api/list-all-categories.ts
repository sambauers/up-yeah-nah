import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { listCategoriesWithRecursive } from '../helpers'
import type { CategoriesFilterQueryParams, Category } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  filter?: CategoriesFilterQueryParams
  page?: PaginationQueryParams
}

export async function listAllCategories(
  context: Context,
  params?: Params,
): Promise<Category[]> {
  return listCategoriesWithRecursive(context, {
    ...params,
    recursive: true,
  })
}
