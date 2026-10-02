import { describe, expect, it } from 'vitest'
import { foundationContent } from './data/foundation'
import {
  collectIntegrityIssues,
  collectPilotReadinessIssues,
  contentRegistry,
  getContentCopy,
  parseContentRegistry,
} from './registry'
import { ContentRegistrySchema } from './schemas/registry'
import { ReviewMetadataSchema } from './schemas/review'

describe('content registry', () => {
  it('accepts the smallest coherent Phase 1 draft registry', () => {
    expect(() => parseContentRegistry(foundationContent)).not.toThrow()
    expect(collectIntegrityIssues(contentRegistry)).toEqual([])
    expect(contentRegistry.regions).toHaveLength(4)
    expect(contentRegistry.missions).toHaveLength(1)
  })

  it('requires exactly the four MVP regions', () => {
    const invalidRegistry = ContentRegistrySchema.parse(foundationContent)
    invalidRegistry.regions.pop()

    const result = ContentRegistrySchema.safeParse(invalidRegistry)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.some(({ message }) => /regions/i.test(message)),
      ).toBe(true)
    }
  })

  it('rejects a choice whose correct answer is not an option', () => {
    const invalidRegistry = ContentRegistrySchema.parse(foundationContent)
    const choiceStep = invalidRegistry.missions[0]?.steps.find(
      (step) => step.type === 'choice',
    )

    if (!choiceStep || choiceStep.type !== 'choice') {
      throw new Error('Expected the draft mission to include a choice step.')
    }

    choiceStep.correctOptionId = 'missing-option'

    expect(ContentRegistrySchema.safeParse(invalidRegistry).success).toBe(false)
  })

  it('requires audit details before review metadata can be approved', () => {
    const result = ReviewMetadataSchema.safeParse({ state: 'approved' })

    expect(result.success).toBe(false)
  })

  it('reports missing Standard and Simple English copy keys', () => {
    const invalidRegistry = ContentRegistrySchema.parse(foundationContent)
    const standardEnglish = invalidRegistry.locales.find(
      ({ locale, register }) => locale === 'en' && register === 'standard',
    )
    const simpleEnglish = invalidRegistry.locales.find(
      ({ locale, register }) => locale === 'en' && register === 'simple',
    )

    if (!standardEnglish || !simpleEnglish) {
      throw new Error('Expected both English content registers.')
    }

    delete standardEnglish.strings['missions.be-open-minded.title']
    delete simpleEnglish.strings['missions.be-open-minded.choice.prompt']

    const codes = collectIntegrityIssues(invalidRegistry).map(
      ({ code }) => code,
    )

    expect(codes).toContain('MISSING_STANDARD_ENGLISH_KEY')
    expect(codes).toContain('MISSING_SIMPLE_ENGLISH_KEY')
  })

  it('keeps unresolved product decisions visible as pilot blockers', () => {
    const issues = collectPilotReadinessIssues(contentRegistry)
    const codes = issues.map(({ code }) => code)

    expect(codes).toContain('HOME_LOCALE_UNSET')
    expect(codes).toContain('INQUIRY_CYCLE_UNAPPROVED')
    expect(codes).toContain('MISSION_UNAPPROVED')
    expect(codes).toContain('LOCALE_UNAPPROVED')
    expect(codes).not.toContain('MISSION_SEQUENCE_INVALID')
    expect(codes).not.toContain('REWARD_NOT_FINAL')
  })

  it('reports an invalid MVP journey order and missing final reward', () => {
    const invalidRegistry = ContentRegistrySchema.parse(foundationContent)
    const mission = invalidRegistry.missions[0]

    if (!mission) {
      throw new Error('Expected a draft mission.')
    }

    const firstStep = mission.steps.shift()
    if (!firstStep) {
      throw new Error('Expected mission steps.')
    }
    mission.steps.push(firstStep)

    const codes = collectPilotReadinessIssues(invalidRegistry).map(
      ({ code }) => code,
    )
    expect(codes).toContain('MISSION_SEQUENCE_INVALID')
    expect(codes).toContain('REWARD_NOT_FINAL')
  })

  it('invalidates an approved translation tied to an old English revision', () => {
    const invalidRegistry = ContentRegistrySchema.parse(foundationContent)
    const standardEnglish = invalidRegistry.locales.find(
      ({ locale, register }) => locale === 'en' && register === 'standard',
    )

    if (!standardEnglish) {
      throw new Error('Expected Standard English content.')
    }

    invalidRegistry.locales.push({
      ...structuredClone(standardEnglish),
      locale: 'es',
      review: {
        state: 'approved',
        reviewerRole: 'language reviewer',
        reviewedAt: '2026-10-01T00:00:00Z',
        sourceRevision: '0.0.1',
      },
    })

    expect(collectIntegrityIssues(invalidRegistry)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'STALE_TRANSLATION_APPROVAL' }),
      ]),
    )
  })

  it('serves Simple English and preserves an unknown key as a safe fallback', () => {
    expect(
      getContentCopy('missions.be-open-minded.choice.prompt', 'simple'),
    ).toBe('Your partner has a new plan. What can you do first?')
    expect(getContentCopy('missing.copy.key')).toBe('missing.copy.key')
  })

  it('rejects unknown fields instead of silently accepting content drift', () => {
    const invalidRegistry = ContentRegistrySchema.parse(foundationContent)
    Object.assign(invalidRegistry.regions[0] ?? {}, { unexpected: true })

    expect(ContentRegistrySchema.safeParse(invalidRegistry).success).toBe(false)
  })
})
