import { z } from 'zod'

export const pingMetaSchema = z.object({
  id: z.string().uuid(),
  statusEmoji: z.string(),
})

export type PingMeta = z.infer<typeof pingMetaSchema>
