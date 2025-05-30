import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { listTagsWithRecursive } from '../helpers'
import type { Tag } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  page?: PaginationQueryParams
}

export async function listTags(
  context: Context,
  params?: Params,
): Promise<Tag[]> {
  return listTagsWithRecursive(context, params)
}
