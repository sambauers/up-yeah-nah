import { buildApiAggregateError } from '../../shared/helpers'
import type { TokenObject } from '../../shared/schema'
import { utilitiesClient } from '../client'
import type { PingMeta } from '../schema'

interface Context {
  token: TokenObject
}

export async function ping(context: Context): Promise<PingMeta> {
  const {
    token: { token },
  } = context

  const pingResponse = await utilitiesClient.ping({
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if (pingResponse.status !== 200) {
    throw buildApiAggregateError(pingResponse.body, 'Failed to ping API')
  }

  return pingResponse.body.meta
}
