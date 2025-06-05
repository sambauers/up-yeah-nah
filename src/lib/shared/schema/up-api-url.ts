import { z } from 'zod/v4'

export const upApiUrlSchema = z.url({
  protocol: /^https$/,
  hostname: /^api\.up\.com\.au$/,
})

export type UpApiUrl = z.infer<typeof upApiUrlSchema>
