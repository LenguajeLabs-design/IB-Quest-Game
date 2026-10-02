import { z } from 'zod'
import { CopyKeySchema, MapPositionSchema, SlugSchema } from './common'
import { ReviewMetadataSchema } from './review'

export const MVP_REGION_IDS = [
  'learner-profile-peaks',
  'atl-skills-lab',
  'inquiry-river',
  'concept-compass',
] as const

export const RegionIdSchema = z.enum(MVP_REGION_IDS)

export const RegionSchema = z
  .object({
    id: RegionIdSchema,
    nameKey: CopyKeySchema,
    descriptionKey: CopyKeySchema,
    iconId: SlugSchema,
    mapPosition: MapPositionSchema,
    availability: z.enum(['available', 'comingSoon']),
    review: ReviewMetadataSchema,
  })
  .strict()

export const RegionCatalogSchema = z
  .array(RegionSchema)
  .length(MVP_REGION_IDS.length)
  .superRefine((regions, context) => {
    const ids = regions.map(({ id }) => id)
    const uniqueIds = new Set(ids)

    if (uniqueIds.size !== ids.length) {
      context.addIssue({
        code: 'custom',
        message: 'Region IDs must be unique',
      })
    }

    const missingIds = MVP_REGION_IDS.filter((id) => !uniqueIds.has(id))
    if (missingIds.length > 0) {
      context.addIssue({
        code: 'custom',
        message: `Missing MVP regions: ${missingIds.join(', ')}`,
      })
    }
  })

export type Region = z.infer<typeof RegionSchema>
export type RegionId = z.infer<typeof RegionIdSchema>
