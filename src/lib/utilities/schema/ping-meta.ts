import { z } from 'zod'

export const pingMetaSchema = z.object({
  id: z.uuidv4(),
  statusEmoji: z.string(),
})

export type PingMeta = z.infer<typeof pingMetaSchema>
