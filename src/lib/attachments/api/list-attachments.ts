import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { listAttachmentsWithRecursive } from '../helpers'
import type { Attachment } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  page?: PaginationQueryParams
}

export async function listAttachments(
  context: Context,
  params?: Params,
): Promise<Attachment[]> {
  return listAttachmentsWithRecursive(context, params)
}
