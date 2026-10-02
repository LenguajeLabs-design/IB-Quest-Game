import { z } from 'zod'
import {
  CopyKeySchema,
  MapPositionSchema,
  RevisionSchema,
  SlugSchema,
} from './common'
import { ReviewMetadataSchema } from './review'

export const InquiryStageSchema = z
  .object({
    id: SlugSchema,
    labelKey: CopyKeySchema,
    sequence: z.number().int().positive(),
    iconId: SlugSchema,
    mapPosition: MapPositionSchema,
  })
  .strict()

export const InquiryCycleSchema = z
  .object({
    id: SlugSchema,
    revision: RevisionSchema,
    review: ReviewMetadataSchema,
    stages: z.array(InquiryStageSchema).min(3),
  })
  .strict()
  .superRefine(({ stages }, context) => {
    const ids = stages.map(({ id }) => id)
    const sequences = stages.map(({ sequence }) => sequence)

    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: 'custom',
        path: ['stages'],
        message: 'Inquiry stage IDs must be unique',
      })
    }

    if (new Set(sequences).size !== sequences.length) {
      context.addIssue({
        code: 'custom',
        path: ['stages'],
        message: 'Inquiry stage sequences must be unique',
      })
    }
  })

export type InquiryCycle = z.infer<typeof InquiryCycleSchema>
