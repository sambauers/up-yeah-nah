import { buildApiAggregateError } from '../../shared/helpers'
import type { TokenObject } from '../../shared/schema'
import { attachmentsClient } from '../client'
import type { Attachment } from '../schema'

interface Context {
  token: TokenObject
}

interface Params {
  id: string
}

export async function retrieveAttachment(
  context: Context,
  params: Params,
): Promise<Attachment> {
  const {
    token: { token },
  } = context
  const { id } = params

  const retrieveAttachmentResponse = await attachmentsClient.retrieveAttachment(
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params,
    },
  )

  if (retrieveAttachmentResponse.status !== 200) {
    throw buildApiAggregateError(
      retrieveAttachmentResponse.body,
      `Failed to retrieve attachment with ID: ${id}`,
    )
  }

  return retrieveAttachmentResponse.body.data
}
