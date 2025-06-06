import type { ApiFetcherArgs } from '@ts-rest/core'
import { isStandardSchema } from '@ts-rest/core'

import { aggregateErrorFromIssues } from './aggregate-error-from-issues'
import { isAppRouteMutation } from './guards'

type ValidateRequestBodyArgs = {
  args: ApiFetcherArgs
}

export async function validateRequestBody({
  args: { route, body, rawBody },
}: ValidateRequestBodyArgs): Promise<ApiFetcherArgs['body']> {
  // If the route is not a mutation route, it doesn't have a body, so we can
  // return the existing body as is
  if (!isAppRouteMutation(route)) {
    return body
  }

  // If the route's body is not a standard schema, we can return the
  // requested body as is
  if (!isStandardSchema(route.body)) {
    return body
  }

  // Validate the body against the route's body schema
  const result = await route.body['~standard'].validate(rawBody)

  // If there are issues, throw an aggregate error
  if (result.issues) {
    throw aggregateErrorFromIssues(result.issues, 'Invalid request body')
  }

  // Return the validated body as stringified JSON
  return JSON.stringify(result.value)
}
