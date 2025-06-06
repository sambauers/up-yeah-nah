import type {
  ApiFetcher,
  ApiFetcherArgs,
  AppRoute,
  AppRouteMutation,
  StandardSchemaV1,
} from '@ts-rest/core'
import {
  convertQueryParamsToUrlString,
  insertParamsIntoPath,
  isStandardSchema,
  tsRestFetchApi,
} from '@ts-rest/core'
import { z } from 'zod/v4'

function isAppRouteMutation(route: AppRoute): route is AppRouteMutation {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(route.method)
}

function isPathParams(
  maybe: unknown,
): maybe is Record<string | number, string | number> {
  return (
    typeof maybe === 'object' &&
    maybe !== null &&
    !Array.isArray(maybe) &&
    Object.keys(maybe).every(
      (key) => typeof key === 'string' || typeof key === 'number',
    ) &&
    Object.values(maybe).every(
      (value) => typeof value === 'string' || typeof value === 'number',
    )
  )
}

function errorFromIssue({ message, path }: StandardSchemaV1.Issue) {
  const pathString =
    Array.isArray(path) && path.length > 0 ? `${path.join('.')}: ` : ''
  return new Error(`${pathString}${message}`)
}

function aggregateErrorFromIssues(
  issues: readonly StandardSchemaV1.Issue[],
  message: string,
): AggregateError {
  return new AggregateError(issues.map(errorFromIssue), message)
}

interface RestFetchApiArgs extends ApiFetcherArgs {
  baseUrl: string
}

export async function restFetchApi(
  args: RestFetchApiArgs,
): ReturnType<ApiFetcher> {
  // Destructure the arguments for easier access
  const { route, path, headers, rawBody, rawQuery, baseUrl } = args

  // Create a URL object from the path
  const url = new URL(path)

  // Validate the request headers
  if (route.headers) {
    // Get any schemas from the route headers
    const schemas = Object.entries(route.headers).flatMap<
      [string, StandardSchemaV1<unknown, unknown>]
    >(([key, value]) => (isStandardSchema(value) ? [[key, value]] : []))

    // If there are schemas, we need to validate
    if (schemas.length > 0) {
      // Push all the headers into a single Zod object schema
      const headersSchema = z.object(Object.fromEntries(schemas))

      // For consistency, use the standard schema API
      const result = await headersSchema['~standard'].validate(headers)

      // If there are issues, throw an aggregate error
      if (result.issues) {
        throw aggregateErrorFromIssues(result.issues, `Invalid request header`)
      }

      // If the validation passed, we can set the headers - we do this because
      // the headers may have been transformed by the schema validation
      Object.entries(result.value).forEach(([key, value]) => {
        // Set the header on the args
        args.headers[key] = String(value)
      })
    }
  }

  // Validate the request path parameters
  if (isStandardSchema(route.pathParams)) {
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

    // Set the URL pathname to the new route path
    url.pathname = `${pathnameBeforeRoutePath}${safeRoutePath}`
  }

  // Validate the request query parameters
  if (isStandardSchema(route.query)) {
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
    url.search = convertQueryParamsToUrlString(result.value)
  }

  // Validate the request body
  if (isAppRouteMutation(route) && isStandardSchema(route.body)) {
    // Validate the body against the route's body schema
    const result = await route.body['~standard'].validate(rawBody)

    // If there are issues, throw an aggregate error
    if (result.issues) {
      throw aggregateErrorFromIssues(result.issues, 'Invalid request body')
    }

    // If the validation passed, we can set the body on the args - we do this
    // because the body may have been transformed by the schema validation
    args.body = JSON.stringify(result.value)
  }

  // Update the args path
  args.path = url.toString()

  // Everything is valid, so we can call the tsRestFetchApi
  return tsRestFetchApi(args)
}
