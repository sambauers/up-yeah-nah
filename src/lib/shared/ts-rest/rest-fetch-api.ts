import type {
  ApiFetcher,
  ApiFetcherArgs,
  AppRoute,
  AppRouteMutation,
} from '@ts-rest/core'
import {
  convertQueryParamsToUrlString,
  insertParamsIntoPath,
  isZodObjectStrict,
  tsRestFetchApi,
} from '@ts-rest/core'

function isAppRouteMutation(route: AppRoute): route is AppRouteMutation {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(route.method)
}

interface Args extends ApiFetcherArgs {
  baseUrl: string
}

export async function restFetchApi(args: Args): ReturnType<ApiFetcher> {
  const { route, path, headers, rawBody, rawQuery, baseUrl } = args

  const url = new URL(path)

  if (isZodObjectStrict(route.headers)) {
    const safeHeaders = route.headers.parse(headers)
    args.headers = safeHeaders
  }

  if (isZodObjectStrict(route.pathParams)) {
    const routePathParts = route.path.split('/').filter((part) => !!part)
    const basePathParts = `${url.origin}${url.pathname}`
      .replace(baseUrl, '')
      .split('/')
      .filter((part) => !!part)

    const params = Object.fromEntries(
      routePathParts.map((part, index) => {
        if (part.startsWith(':')) {
          const paramName = part.slice(1)
          return [paramName, basePathParts[index]]
        }
        return [part, basePathParts[index]]
      }),
    )
    const safePathParams = route.pathParams.parse(params)
    const safeRoutePath = insertParamsIntoPath({
      path: route.path,
      params: safePathParams,
    })
    const pathnameBeforeRoutePath = baseUrl.replace(url.origin, '')
    url.pathname = `${pathnameBeforeRoutePath}${safeRoutePath}`
  }

  if (isZodObjectStrict(route.query)) {
    const safeQuery = route.query.parse(rawQuery)
    url.search = convertQueryParamsToUrlString(safeQuery)
  }

  if (isAppRouteMutation(route) && isZodObjectStrict(route.body)) {
    const safeBody = route.body.parse(rawBody)
    args.body = JSON.stringify(safeBody)
  }

  args.path = url.toString()

  return tsRestFetchApi(args)
}
