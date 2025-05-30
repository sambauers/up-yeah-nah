import { buildApiAggregateError } from '../../shared/helpers'
import type { PaginationQueryParams, TokenObject } from '../../shared/schema'
import { tagsClient } from '../client'
import type { Tag } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  recursive?: boolean
  page?: Omit<PaginationQueryParams, 'size'> & {
    size?: number
  }
}

export async function listTagsWithRecursive(
  context: Context,
  params?: Params,
): Promise<Tag[]> {
  const {
    token: { token },
  } = context

  const { recursive, page } = params ?? {}

  const safeRecursive = typeof recursive === 'boolean' ? recursive : false

  const listTagsResponse = await tagsClient.listTags({
    headers: {
      authorization: `Bearer ${token}`,
    },
    query: {
      page,
    },
  })

  if (listTagsResponse.status !== 200) {
    throw buildApiAggregateError(listTagsResponse.body, 'Failed to fetch tags')
  }

  const tags = listTagsResponse.body.data
  const pagination = listTagsResponse.body.links

  if (tags.length === 0) {
    // console.warn('No tags found.')
    return []
  }

  // console.log(`Found ${tags.length} tags.`)

  if (safeRecursive && pagination.next) {
    const nextUrl = new URL(pagination.next)
    const pageAfter = nextUrl.searchParams.get('page[after]')

    // Recursively fetch next page if available
    if (pageAfter) {
      // console.log(`Next page available: ${pageAfter}`)
      const nextTags = await listTagsWithRecursive(context, {
        ...params,
        page: {
          ...page,
          after: pageAfter,
        },
      })
      tags.push(...nextTags)
    }
  }

  return tags
}
