import { z } from 'zod/v4'

export const ownershipTypeSchema = z.enum(['INDIVIDUAL', 'JOINT'])

export type OwnershipType = z.infer<typeof ownershipTypeSchema>
