import { z } from 'zod'
import { InquiryCycleSchema } from './inquiry'
import { LocaleBundleSchema } from './locale'
import { MissionSchema } from './mission'
import { RegionCatalogSchema } from './region'

export const ContentRegistrySchema = z
  .object({
    homeLocale: z.string().nullable(),
    regions: RegionCatalogSchema,
    inquiryCycle: InquiryCycleSchema,
    missions: z.array(MissionSchema).min(1),
    locales: z.array(LocaleBundleSchema).min(2),
  })
  .strict()
  .superRefine(({ locales, missions }, context) => {
    const missionIds = missions.map(({ id }) => id)
    if (new Set(missionIds).size !== missionIds.length) {
      context.addIssue({
        code: 'custom',
        path: ['missions'],
        message: 'Mission IDs must be unique',
      })
    }

    const bundleIds = locales.map(
      ({ locale, namespace, register }) => `${locale}:${register}:${namespace}`,
    )
    if (new Set(bundleIds).size !== bundleIds.length) {
      context.addIssue({
        code: 'custom',
        path: ['locales'],
        message: 'Locale, register, and namespace combinations must be unique',
      })
    }
  })

export type ContentRegistry = z.infer<typeof ContentRegistrySchema>
