import { insertParamsIntoPath, isStandardSchema } from '@ts-rest/core'

import { RestFetchApiArgs } from '.'
import { aggregateErrorFromIssues } from './aggregate-error-from-issues'
import { isPathParams } from './guards'

type ValidateRequestPathParamsArgs = {
  args: RestFetchApiArgs
  url: URL
}

export async function validateRequestPathParams({
  args: { route, baseUrl },
  url,
}: ValidateRequestPathParamsArgs): Promise<URL['pathname']> {
  // If the path parameters are not a standard schema, we can return the
  // requested URL path as is
  if (!isStandardSchema(route.pathParams)) {
    return url.pathname
  }

  // Split the route path into parts
  const routePathParts = route.path.split('/').filter((part) => !!part)

  // Split the requested URL into parts, excluding the base URL
  const basePathParts = `${url.origin}${url.pathname}`
    .replace(baseUrl, '')
    .split('/')
    .filter((part) => !!part)

  // Load the parameters from the route path into an object
  const params = Object.fromEntries(
    routePathParts.flatMap((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1)
        return [[paramName, basePathParts[index]]]
      }
      return []
    }),
  )

  // Validate the parameters against the route's pathParams schema
  const result = await route.pathParams['~standard'].validate(params)

  // If there are issues, throw an aggregate error
  if (result.issues) {
    throw aggregateErrorFromIssues(
      result.issues,
      'Invalid request path parameters',
    )
  }

  // If the validation passed, we can set the params on the path - we do this
  // because the params may have been transformed by the schema validation

  // We need to ensure that the value is an object with the right structure
  const safeParams = isPathParams(result.value) ? result.value : {}

  // Create a new route path with the parameters inserted
  const safeRoutePath = insertParamsIntoPath({
    path: route.path,
    params: safeParams,
  })

  // Get the pathname before the route path
  const pathnameBeforeRoutePath = baseUrl.replace(url.origin, '')

  // Return the new route path
  return `${pathnameBeforeRoutePath}${safeRoutePath}`
}
