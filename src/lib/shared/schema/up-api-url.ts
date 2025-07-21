import { z } from 'zod'

export const upApiUrlSchema = z.url({
  protocol: /^https$/,
  hostname: /^api\.up\.com\.au$/,
})

export type UpApiUrl = z.infer<typeof upApiUrlSchema>
