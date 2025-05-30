import { TokenObject } from '../../shared/schema'
import { tagsClient } from '../client'

interface Context {
  token: TokenObject
}

interface Params {
  transactionId: string
  tagIds?: string | string[] | null
}

export async function addTagsToTransaction(context: Context, params: Params) {
  const {
    token: { token },
  } = context
  const { transactionId, tagIds } = params

  const safeTagIds = Array.isArray(tagIds) ? tagIds : tagIds ? [tagIds] : []

  const tagObjects = safeTagIds.map((tagId) => ({
    type: 'tags' as const,
    id: tagId,
  }))

  return tagsClient.addTagsToTransaction({
    headers: {
      authorization: `Bearer ${token}`,
    },
    params: {
      transactionId,
    },
    body: {
      data: tagObjects,
    },
  })
}
