import type { ApiFetcher, ApiFetcherArgs } from '@ts-rest/core'
import { tsRestFetchApi } from '@ts-rest/core'

import { validateRequestBody } from './validate-request-body'
import { validateRequestHeaders } from './validate-request-headers'
import { validateRequestPathParams } from './validate-request-path-params'
import { validateRequestQueryParams } from './validate-request-query-params'

export interface RestFetchApiArgs extends ApiFetcherArgs {
  baseUrl: string
}

export async function restFetchApi(
  args: RestFetchApiArgs,
): ReturnType<ApiFetcher> {
  // Create a URL object from the args path
  const url = new URL(args.path)

  // Validate the request headers
  args.headers = await validateRequestHeaders({ args })

  // Validate the request path parameters
  url.pathname = await validateRequestPathParams({
    args,
    url,
  })

  // Validate the request query parameters
  url.search = await validateRequestQueryParams({
    args,
    url,
  })

  // Validate the request body
  args.body = await validateRequestBody({ args })

  // Update the args path
  args.path = url.toString()

  // Everything is valid, so we can call the tsRestFetchApi
  return tsRestFetchApi(args)
}
