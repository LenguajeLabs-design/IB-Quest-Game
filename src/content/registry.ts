import { foundationContent } from './data/foundation'
import type { LocaleBundle } from './schemas/locale'
import type { Mission, MissionStep } from './schemas/mission'
import { ContentRegistrySchema, type ContentRegistry } from './schemas/registry'

export type ContentIssueCode =
  | 'DUPLICATE_REFERENCE'
  | 'HOME_LOCALE_UNSET'
  | 'INQUIRY_CYCLE_UNAPPROVED'
  | 'LOCALE_UNAPPROVED'
  | 'MISSION_REGION_UNKNOWN'
  | 'MISSION_SEQUENCE_INVALID'
  | 'MISSION_UNAPPROVED'
  | 'MISSING_SIMPLE_ENGLISH_KEY'
  | 'MISSING_STANDARD_ENGLISH_KEY'
  | 'REWARD_NOT_FINAL'
  | 'STALE_TRANSLATION_APPROVAL'

export type ContentIssue = {
  code: ContentIssueCode
  message: string
  path: string
}

const missionStepOrder = [
  'story',
  'term',
  'exampleComparison',
  'choice',
  'reflection',
  'reward',
] as const

function getStepCopyKeys(step: MissionStep): string[] {
  switch (step.type) {
    case 'story':
      return [step.bodyKey]
    case 'term':
      return [step.termKey, step.definitionKey]
    case 'exampleComparison':
      return [step.promptKey, step.exampleKey, step.nonExampleKey]
    case 'choice':
      return [
        step.promptKey,
        ...step.options.map(({ labelKey }) => labelKey),
        step.correctFeedbackKey,
        step.retryFeedbackKey,
      ]
    case 'reflection':
      return [step.promptKey, step.sentenceStarterKey]
    case 'reward':
      return [step.titleKey, step.bodyKey]
  }
}

function getRequiredCopyKeys(registry: ContentRegistry): string[] {
  return [
    ...registry.regions.flatMap(({ descriptionKey, nameKey }) => [
      nameKey,
      descriptionKey,
    ]),
    ...registry.inquiryCycle.stages.map(({ labelKey }) => labelKey),
    ...registry.missions.flatMap((mission) => [
      mission.titleKey,
      mission.objectiveKey,
      ...mission.steps.flatMap(getStepCopyKeys),
    ]),
  ]
}

function getSimpleEnglishKeys(mission: Mission): string[] {
  return [
    mission.objectiveKey,
    ...mission.steps.flatMap((step) => {
      if (step.type === 'term') return [step.definitionKey]
      return getStepCopyKeys(step)
    }),
  ]
}

function findBundle(
  registry: ContentRegistry,
  locale: string,
  register: LocaleBundle['register'],
): LocaleBundle | undefined {
  return registry.locales.find(
    (bundle) =>
      bundle.locale === locale &&
      bundle.register === register &&
      bundle.namespace === 'content',
  )
}

export function collectIntegrityIssues(
  registry: ContentRegistry,
): ContentIssue[] {
  const issues: ContentIssue[] = []
  const regionIds = new Set(registry.regions.map(({ id }) => id))
  const standardEnglish = findBundle(registry, 'en', 'standard')
  const simpleEnglish = findBundle(registry, 'en', 'simple')

  for (const mission of registry.missions) {
    if (!regionIds.has(mission.regionId)) {
      issues.push({
        code: 'MISSION_REGION_UNKNOWN',
        path: `missions.${mission.id}.regionId`,
        message: `Mission ${mission.id} references an unknown region.`,
      })
    }
  }

  for (const copyKey of new Set(getRequiredCopyKeys(registry))) {
    if (!standardEnglish || !(copyKey in standardEnglish.strings)) {
      issues.push({
        code: 'MISSING_STANDARD_ENGLISH_KEY',
        path: `locales.en.standard.${copyKey}`,
        message: `Standard English is missing ${copyKey}.`,
      })
    }
  }

  for (const mission of registry.missions) {
    for (const copyKey of new Set(getSimpleEnglishKeys(mission))) {
      if (!simpleEnglish || !(copyKey in simpleEnglish.strings)) {
        issues.push({
          code: 'MISSING_SIMPLE_ENGLISH_KEY',
          path: `locales.en.simple.${copyKey}`,
          message: `Simple English is missing ${copyKey}.`,
        })
      }
    }
  }

  if (standardEnglish) {
    for (const bundle of registry.locales) {
      if (
        bundle.locale !== 'en' &&
        bundle.review.state === 'approved' &&
        bundle.review.sourceRevision !== standardEnglish.revision
      ) {
        issues.push({
          code: 'STALE_TRANSLATION_APPROVAL',
          path: `locales.${bundle.locale}.${bundle.register}.review.sourceRevision`,
          message: `${bundle.locale} approval does not match English revision ${standardEnglish.revision}.`,
        })
      }
    }
  }

  return issues
}

export function collectPilotReadinessIssues(
  registry: ContentRegistry,
): ContentIssue[] {
  const issues = [...collectIntegrityIssues(registry)]

  if (registry.homeLocale === null) {
    issues.push({
      code: 'HOME_LOCALE_UNSET',
      path: 'homeLocale',
      message: 'The school has not selected the MVP home language.',
    })
  }

  if (registry.inquiryCycle.review.state !== 'approved') {
    issues.push({
      code: 'INQUIRY_CYCLE_UNAPPROVED',
      path: 'inquiryCycle.review',
      message: 'The inquiry-cycle wording has not been approved.',
    })
  }

  for (const mission of registry.missions) {
    if (mission.review.state !== 'approved') {
      issues.push({
        code: 'MISSION_UNAPPROVED',
        path: `missions.${mission.id}.review`,
        message: `Mission ${mission.id} has not been approved.`,
      })
    }

    const actualOrder = mission.steps.map(({ type }) => type)
    const expectedOrder = [...missionStepOrder]
    if (
      actualOrder.length !== expectedOrder.length ||
      actualOrder.some((type, index) => type !== expectedOrder[index])
    ) {
      issues.push({
        code: 'MISSION_SEQUENCE_INVALID',
        path: `missions.${mission.id}.steps`,
        message: `Mission ${mission.id} does not use the required MVP learning sequence.`,
      })
    }

    if (mission.steps.at(-1)?.type !== 'reward') {
      issues.push({
        code: 'REWARD_NOT_FINAL',
        path: `missions.${mission.id}.steps`,
        message: `Mission ${mission.id} must end with its reward step.`,
      })
    }
  }

  for (const bundle of registry.locales) {
    if (bundle.review.state !== 'approved') {
      issues.push({
        code: 'LOCALE_UNAPPROVED',
        path: `locales.${bundle.locale}.${bundle.register}.review`,
        message: `${bundle.locale}/${bundle.register} copy has not been approved.`,
      })
    }
  }

  return issues
}

export function parseContentRegistry(input: unknown): ContentRegistry {
  const registry = ContentRegistrySchema.parse(input)
  const issues = collectIntegrityIssues(registry)

  if (issues.length > 0) {
    throw new Error(
      `Content registry integrity failed:\n${issues
        .map((issue) => `- [${issue.code}] ${issue.path}: ${issue.message}`)
        .join('\n')}`,
    )
  }

  return registry
}

export const contentRegistry = parseContentRegistry(foundationContent)

export function getContentCopy(
  key: string,
  register: LocaleBundle['register'] = 'standard',
): string {
  const bundle = findBundle(contentRegistry, 'en', register)
  return bundle?.strings[key] ?? key
}
