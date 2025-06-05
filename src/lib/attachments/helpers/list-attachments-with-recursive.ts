import { buildApiAggregateError } from '../../shared/helpers'
import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { attachmentsClient } from '../client'
import type { Attachment } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  recursive?: boolean
  page?: PaginationQueryParams
}

export async function listAttachmentsWithRecursive(
  context: Context,
  params?: Params,
): Promise<Attachment[]> {
  const {
    token: { token },
  } = context

  const { recursive, page } = params ?? {}

  const safeRecursive = typeof recursive === 'boolean' ? recursive : false

  const listAttachmentsResponse = await attachmentsClient.listAttachments({
    headers: {
      authorization: `Bearer ${token}`,
    },
    query: {
      page,
    },
  })

  if (listAttachmentsResponse.status !== 200) {
    throw buildApiAggregateError(
      listAttachmentsResponse.body,
      'Failed to fetch attachments',
    )
  }

  const attachments = listAttachmentsResponse.body.data
  const pagination = listAttachmentsResponse.body.links

  if (attachments.length === 0) {
    // console.warn('No attachments found.')
    return []
  }

  // console.log(`Found ${attachments.length} attachments.`)

  if (safeRecursive && pagination.next) {
    const nextUrl = new URL(pagination.next)
    const pageAfter = nextUrl.searchParams.get('page[after]')

    // Recursively fetch next page if available
    if (pageAfter) {
      // console.log(`Next page available: ${pageAfter}`)
      const nextAttachments = await listAttachmentsWithRecursive(context, {
        ...params,
        page: {
          ...page,
          after: pageAfter,
        },
      })
      attachments.push(...nextAttachments)
    }
  }

  return attachments
}
