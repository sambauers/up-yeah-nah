import type { ApiFetcherArgs } from '@ts-rest/core'
import { convertQueryParamsToUrlString, isStandardSchema } from '@ts-rest/core'

import { aggregateErrorFromIssues } from './aggregate-error-from-issues'

type ValidateRequestQueryParamsArgs = {
  args: ApiFetcherArgs
  url: URL
}

export async function validateRequestQueryParams({
  args: { route, rawQuery },
  url,
}: ValidateRequestQueryParamsArgs): Promise<URL['search']> {
  // If the route query is not a standard schema, we can return the
  // requested URL search as is
  if (!isStandardSchema(route.query)) {
    return url.search
  }

  // Validate the query parameters against the route's query schema
  const result = await route.query['~standard'].validate(rawQuery)

  // If there are issues, throw an aggregate error
  if (result.issues) {
    throw aggregateErrorFromIssues(
      result.issues,
      'Invalid request query parameters',
    )
  }

  // If the validation passed, we can set the query parameters on the URL - we
  // do this because the query parameters may have been transformed by the
  // schema validation
  return convertQueryParamsToUrlString(result.value)
}
