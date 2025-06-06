import type { ApiFetcherArgs, StandardSchemaV1 } from '@ts-rest/core'
import { isStandardSchema } from '@ts-rest/core'
import { z } from 'zod/v4'

import { aggregateErrorFromIssues } from './aggregate-error-from-issues'

type ValidateRequestHeadersArgs = {
  args: ApiFetcherArgs
}

export async function validateRequestHeaders({
  args: { route, headers },
}: ValidateRequestHeadersArgs): Promise<ApiFetcherArgs['headers']> {
  // There are no headers defined on the route, so return the existing headers
  if (!route.headers) {
    return headers
  }

  // Get any schemas from the route headers
  const schemas = Object.entries(route.headers).flatMap<
    [string, StandardSchemaV1<unknown, unknown>]
  >(([key, value]) => (isStandardSchema(value) ? [[key, value]] : []))

  // If there are no schemas, we don't need to validate
  if (schemas.length <= 0) {
    return headers
  }

  // Create a replacement headers object to store the validated headers
  const replacementHeaders: Record<string, string> = {
    ...headers, // Start with the existing headers
  }

  // Push all the headers into a single Zod object schema
  const headersSchema = z.object(Object.fromEntries(schemas))

  // For consistency, use the standard schema API
  const result = await headersSchema['~standard'].validate(headers)

  // If there are issues, throw an aggregate error
  if (result.issues) {
    throw aggregateErrorFromIssues(result.issues, `Invalid request header`)
  }

  // If the validation passed, we can set the headers - we do this because the
  // headers may have been transformed by the schema validation
  Object.entries(result.value).forEach(([key, value]) => {
    // Set the header on the args
    replacementHeaders[key] = String(value)
  })

  // Return the replacement headers
  return replacementHeaders
}
