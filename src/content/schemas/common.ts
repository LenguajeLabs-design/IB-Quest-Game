import { z } from 'zod'

export const SlugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Expected a lowercase slug')

export const CopyKeySchema = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/,
    'Expected a namespaced lowercase copy key',
  )

export const MapPositionSchema = z
  .object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  })
  .strict()

export const RevisionSchema = z
  .string()
  .min(1)
  .regex(/^\d+\.\d+\.\d+$/, 'Expected a semantic version')

export const LocaleTagSchema = z
  .string()
  .min(2)
  .refine(
    (locale) => {
      try {
        return Intl.getCanonicalLocales(locale).length === 1
      } catch {
        return false
      }
    },
    { message: 'Expected a valid BCP 47 locale tag' },
  )
