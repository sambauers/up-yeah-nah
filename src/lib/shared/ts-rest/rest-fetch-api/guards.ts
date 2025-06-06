import type { AppRoute, AppRouteMutation } from '@ts-rest/core'
import { z } from 'zod/v4'

const mutationMethodSchema = z.enum(['POST', 'PUT', 'PATCH', 'DELETE'])

export function isAppRouteMutation(route: AppRoute): route is AppRouteMutation {
  const result = mutationMethodSchema.safeParse(route.method)
  return result.success
}

const pathParamsSchema = z.record(
  z.union([z.string(), z.number()]),
  z.union([z.string(), z.number()]),
)

export function isPathParams(
  maybe: unknown,
): maybe is Record<string | number, string | number> {
  const result = pathParamsSchema.safeParse(maybe)
  return result.success
}
