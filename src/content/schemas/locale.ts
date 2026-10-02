import { z } from 'zod'
import { LocaleTagSchema, RevisionSchema, SlugSchema } from './common'
import { ReviewMetadataSchema } from './review'

export const LocaleBundleSchema = z
  .object({
    locale: LocaleTagSchema,
    register: z.enum(['standard', 'simple']),
    direction: z.enum(['ltr', 'rtl']),
    namespace: SlugSchema,
    revision: RevisionSchema,
    review: ReviewMetadataSchema,
    strings: z.record(z.string(), z.string().min(1)),
  })
  .strict()

export type LocaleBundle = z.infer<typeof LocaleBundleSchema>
