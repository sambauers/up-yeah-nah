import { z } from 'zod/v4'

import { categoryIdSchema } from './category-id'

export const categoriesFilterQueryParamsSchema = z
  .object({
    parent: categoryIdSchema,
  })
  .optional()

export type CategoriesFilterQueryParams = z.infer<
  typeof categoriesFilterQueryParamsSchema
>
