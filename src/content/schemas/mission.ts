import { z } from 'zod'
import { CopyKeySchema, RevisionSchema, SlugSchema } from './common'
import { RegionIdSchema } from './region'
import { ReviewMetadataSchema } from './review'

const StepBaseSchema = z.object({
  id: SlugSchema,
})

const StoryStepSchema = StepBaseSchema.extend({
  type: z.literal('story'),
  bodyKey: CopyKeySchema,
}).strict()

const TermStepSchema = StepBaseSchema.extend({
  type: z.literal('term'),
  termId: SlugSchema,
  termKey: CopyKeySchema,
  definitionKey: CopyKeySchema,
}).strict()

const ExampleComparisonStepSchema = StepBaseSchema.extend({
  type: z.literal('exampleComparison'),
  promptKey: CopyKeySchema,
  exampleKey: CopyKeySchema,
  nonExampleKey: CopyKeySchema,
}).strict()

const ChoiceOptionSchema = z
  .object({
    id: SlugSchema,
    labelKey: CopyKeySchema,
  })
  .strict()

const ChoiceStepSchema = StepBaseSchema.extend({
  type: z.literal('choice'),
  promptKey: CopyKeySchema,
  options: z.array(ChoiceOptionSchema).min(2),
  correctOptionId: SlugSchema,
  correctFeedbackKey: CopyKeySchema,
  retryFeedbackKey: CopyKeySchema,
})
  .strict()
  .superRefine(({ correctOptionId, options }, context) => {
    const optionIds = options.map(({ id }) => id)

    if (new Set(optionIds).size !== optionIds.length) {
      context.addIssue({
        code: 'custom',
        path: ['options'],
        message: 'Choice option IDs must be unique',
      })
    }

    if (!optionIds.includes(correctOptionId)) {
      context.addIssue({
        code: 'custom',
        path: ['correctOptionId'],
        message: 'The correct choice must reference an existing option',
      })
    }
  })

const ReflectionStepSchema = StepBaseSchema.extend({
  type: z.literal('reflection'),
  promptKey: CopyKeySchema,
  sentenceStarterKey: CopyKeySchema,
}).strict()

const RewardStepSchema = StepBaseSchema.extend({
  type: z.literal('reward'),
  rewardId: SlugSchema,
  titleKey: CopyKeySchema,
  bodyKey: CopyKeySchema,
}).strict()

export const MissionStepSchema = z.discriminatedUnion('type', [
  StoryStepSchema,
  TermStepSchema,
  ExampleComparisonStepSchema,
  ChoiceStepSchema,
  ReflectionStepSchema,
  RewardStepSchema,
])

export const MissionSchema = z
  .object({
    id: SlugSchema,
    regionId: RegionIdSchema,
    revision: RevisionSchema,
    review: ReviewMetadataSchema,
    titleKey: CopyKeySchema,
    objectiveKey: CopyKeySchema,
    durationMinutes: z.number().int().min(5).max(10),
    targetTermIds: z.array(SlugSchema).min(1),
    steps: z.array(MissionStepSchema).min(6),
    rewardId: SlugSchema,
  })
  .strict()
  .superRefine(({ rewardId, steps }, context) => {
    const stepIds = steps.map(({ id }) => id)
    if (new Set(stepIds).size !== stepIds.length) {
      context.addIssue({
        code: 'custom',
        path: ['steps'],
        message: 'Mission step IDs must be unique',
      })
    }

    const rewardSteps = steps.filter((step) => step.type === 'reward')
    if (
      rewardSteps.length > 0 &&
      rewardSteps.some((step) => step.rewardId !== rewardId)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['rewardId'],
        message: 'Mission and reward-step IDs must match',
      })
    }
  })

export type Mission = z.infer<typeof MissionSchema>
export type MissionStep = z.infer<typeof MissionStepSchema>
