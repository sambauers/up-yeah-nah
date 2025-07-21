import { z } from 'zod'

import { categoryIdSchema } from './category-id'

export const categoriesFilterQueryParamsSchema = z
  .object({
    parent: categoryIdSchema,
  })
  .optional()

export type CategoriesFilterQueryParams = z.infer<
  typeof categoriesFilterQueryParamsSchema
>
