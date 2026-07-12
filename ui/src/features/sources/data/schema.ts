import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const sourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.string(),
  source: z.string(),
  isConfiged: z.boolean(),
})

export type Source = z.infer<typeof sourceSchema>
