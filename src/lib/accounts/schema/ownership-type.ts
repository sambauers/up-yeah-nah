import { z } from 'zod'

export const ownershipTypeSchema = z.enum(['INDIVIDUAL', 'JOINT'])

export type OwnershipType = z.infer<typeof ownershipTypeSchema>
