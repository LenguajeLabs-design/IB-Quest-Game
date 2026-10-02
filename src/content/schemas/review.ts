import { z } from 'zod'

const DraftReviewSchema = z
  .object({
    state: z.literal('draft'),
    note: z.string().min(1).optional(),
  })
  .strict()

const InReviewSchema = z
  .object({
    state: z.literal('review'),
    reviewerRole: z.string().min(1),
    sourceRevision: z.string().min(1),
    note: z.string().min(1).optional(),
  })
  .strict()

const ApprovedReviewSchema = z
  .object({
    state: z.literal('approved'),
    reviewerRole: z.string().min(1),
    reviewedAt: z.iso.datetime({ offset: true }),
    sourceRevision: z.string().min(1),
    note: z.string().min(1).optional(),
  })
  .strict()

export const ReviewMetadataSchema = z.discriminatedUnion('state', [
  DraftReviewSchema,
  InReviewSchema,
  ApprovedReviewSchema,
])

export type ReviewMetadata = z.infer<typeof ReviewMetadataSchema>
