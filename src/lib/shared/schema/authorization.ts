import { z } from 'zod'

export const tokenSchema = z.string().startsWith('up:yeah:')

export const tokenObjectSchema = z.object({
  owner: z.string().min(1),
  token: tokenSchema,
})

export type TokenObject = z.infer<typeof tokenObjectSchema>

export const bearerSchema = z.string().startsWith('Bearer up:yeah:')
