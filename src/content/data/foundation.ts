import type { ContentRegistry } from '../schemas/registry'

export const foundationContent = {
  homeLocale: null,
  regions: [
    {
      id: 'learner-profile-peaks',
      nameKey: 'regions.learner-profile-peaks.name',
      descriptionKey: 'regions.learner-profile-peaks.description',
      iconId: 'peaks',
      mapPosition: { x: 20, y: 28 },
      availability: 'available',
      review: {
        state: 'draft',
        note: 'Name from the source brief; school approval is pending.',
      },
    },
    {
      id: 'atl-skills-lab',
      nameKey: 'regions.atl-skills-lab.name',
      descriptionKey: 'regions.atl-skills-lab.description',
      iconId: 'lab',
      mapPosition: { x: 72, y: 24 },
      availability: 'comingSoon',
      review: {
        state: 'draft',
        note: 'Name from the source brief; school approval is pending.',
      },
    },
    {
      id: 'inquiry-river',
      nameKey: 'regions.inquiry-river.name',
      descriptionKey: 'regions.inquiry-river.description',
      iconId: 'river',
      mapPosition: { x: 65, y: 72 },
      availability: 'comingSoon',
      review: {
        state: 'draft',
        note: 'Name from the source brief; school approval is pending.',
      },
    },
    {
      id: 'concept-compass',
      nameKey: 'regions.concept-compass.name',
      descriptionKey: 'regions.concept-compass.description',
      iconId: 'compass',
      mapPosition: { x: 25, y: 76 },
      availability: 'comingSoon',
      review: {
        state: 'draft',
        note: 'Name from the source brief; school approval is pending.',
      },
    },
  ],
  inquiryCycle: {
    id: 'school-inquiry-cycle',
    revision: '0.1.0',
    review: {
      state: 'draft',
      note: 'Placeholder wording from the source brief; replace with school-approved labels.',
    },
    stages: [
      {
        id: 'asking',
        labelKey: 'inquiry.asking.name',
        sequence: 1,
        iconId: 'question',
        mapPosition: { x: 10, y: 50 },
      },
      {
        id: 'investigating',
        labelKey: 'inquiry.investigating.name',
        sequence: 2,
        iconId: 'magnifier',
        mapPosition: { x: 30, y: 50 },
      },
      {
        id: 'creating',
        labelKey: 'inquiry.creating.name',
        sequence: 3,
        iconId: 'spark',
        mapPosition: { x: 50, y: 50 },
      },
      {
        id: 'reflecting',
        labelKey: 'inquiry.reflecting.name',
        sequence: 4,
        iconId: 'mirror',
        mapPosition: { x: 70, y: 50 },
      },
      {
        id: 'acting',
        labelKey: 'inquiry.acting.name',
        sequence: 5,
        iconId: 'footsteps',
        mapPosition: { x: 90, y: 50 },
      },
    ],
  },
  missions: [
    {
      id: 'be-open-minded',
      regionId: 'learner-profile-peaks',
      revision: '0.1.0',
      review: {
        state: 'draft',
        note: 'Learning copy requires curriculum and language review.',
      },
      titleKey: 'missions.be-open-minded.title',
      objectiveKey: 'missions.be-open-minded.objective',
      durationMinutes: 7,
      targetTermIds: ['open-minded'],
      steps: [
        {
          id: 'meet-the-team',
          type: 'story',
          bodyKey: 'missions.be-open-minded.story.body',
        },
        {
          id: 'learn-the-term',
          type: 'term',
          termId: 'open-minded',
          termKey: 'missions.be-open-minded.term.label',
          definitionKey: 'missions.be-open-minded.term.definition',
        },
        {
          id: 'compare-examples',
          type: 'exampleComparison',
          promptKey: 'missions.be-open-minded.compare.prompt',
          exampleKey: 'missions.be-open-minded.compare.example',
          nonExampleKey: 'missions.be-open-minded.compare.non-example',
        },
        {
          id: 'choose-a-response',
          type: 'choice',
          promptKey: 'missions.be-open-minded.choice.prompt',
          options: [
            {
              id: 'listen-first',
              labelKey: 'missions.be-open-minded.choice.listen-first',
            },
            {
              id: 'dismiss-idea',
              labelKey: 'missions.be-open-minded.choice.dismiss-idea',
            },
          ],
          correctOptionId: 'listen-first',
          correctFeedbackKey: 'missions.be-open-minded.choice.correct',
          retryFeedbackKey: 'missions.be-open-minded.choice.retry',
        },
        {
          id: 'reflect',
          type: 'reflection',
          promptKey: 'missions.be-open-minded.reflection.prompt',
          sentenceStarterKey:
            'missions.be-open-minded.reflection.sentence-starter',
        },
        {
          id: 'earn-stamp',
          type: 'reward',
          rewardId: 'open-minded-stamp',
          titleKey: 'missions.be-open-minded.reward.title',
          bodyKey: 'missions.be-open-minded.reward.body',
        },
      ],
      rewardId: 'open-minded-stamp',
    },
  ],
  locales: [
    {
      locale: 'en',
      register: 'standard',
      direction: 'ltr',
      namespace: 'content',
      revision: '0.1.0',
      review: {
        state: 'draft',
        note: 'Prototype English copy; human curriculum review is pending.',
      },
      strings: {
        'regions.learner-profile-peaks.name': 'Learner Profile Peaks',
        'regions.learner-profile-peaks.description':
          'Explore how learners think, care, and work with others.',
        'regions.atl-skills-lab.name': 'ATL Skills Lab',
        'regions.atl-skills-lab.description':
          'Practice the skills that help learning travel further.',
        'regions.inquiry-river.name': 'Inquiry River',
        'regions.inquiry-river.description':
          'Follow questions as they grow into new understanding.',
        'regions.concept-compass.name': 'Concept Compass',
        'regions.concept-compass.description':
          'Use big ideas to look at learning from new directions.',
        'inquiry.asking.name': 'Asking',
        'inquiry.investigating.name': 'Investigating',
        'inquiry.creating.name': 'Creating',
        'inquiry.reflecting.name': 'Reflecting',
        'inquiry.acting.name': 'Acting',
        'missions.be-open-minded.title': 'Be Open-Minded',
        'missions.be-open-minded.objective':
          'Notice a different idea and choose a curious response.',
        'missions.be-open-minded.story.body':
          'Two classmates have different ideas for their shared project.',
        'missions.be-open-minded.term.label': 'Open-minded',
        'missions.be-open-minded.term.definition':
          'Being ready to listen to and think about ideas that are different from your own.',
        'missions.be-open-minded.compare.prompt':
          'Which response makes room for a different idea?',
        'missions.be-open-minded.compare.example':
          'I want to hear how your idea could work.',
        'missions.be-open-minded.compare.non-example':
          'My idea is the only one worth trying.',
        'missions.be-open-minded.choice.prompt':
          'A partner suggests a plan you did not expect. What could you do first?',
        'missions.be-open-minded.choice.listen-first':
          'Ask them to explain their thinking.',
        'missions.be-open-minded.choice.dismiss-idea':
          'Tell them your plan is already better.',
        'missions.be-open-minded.choice.correct':
          'That response helps you understand another point of view.',
        'missions.be-open-minded.choice.retry':
          'Try a response that helps you learn more before deciding.',
        'missions.be-open-minded.reflection.prompt':
          'When could you listen to a different idea this week?',
        'missions.be-open-minded.reflection.sentence-starter':
          'I can be open-minded when…',
        'missions.be-open-minded.reward.title': 'Open-Minded Stamp',
        'missions.be-open-minded.reward.body':
          'You practiced listening before deciding.',
      },
    },
    {
      locale: 'en',
      register: 'simple',
      direction: 'ltr',
      namespace: 'content',
      revision: '0.1.0',
      review: {
        state: 'draft',
        note: 'Prototype Simple English; specialist review is pending.',
      },
      strings: {
        'missions.be-open-minded.objective':
          'Hear a new idea. Choose a kind way to learn more.',
        'missions.be-open-minded.story.body':
          'Two students have different ideas for one project.',
        'missions.be-open-minded.term.definition':
          'Listen to ideas that are different from your idea.',
        'missions.be-open-minded.compare.prompt':
          'Which answer helps you hear a new idea?',
        'missions.be-open-minded.compare.example':
          'Please tell me more about your idea.',
        'missions.be-open-minded.compare.non-example': 'Only my idea is good.',
        'missions.be-open-minded.choice.prompt':
          'Your partner has a new plan. What can you do first?',
        'missions.be-open-minded.choice.listen-first':
          'Ask your partner to explain.',
        'missions.be-open-minded.choice.dismiss-idea':
          'Say your plan is better.',
        'missions.be-open-minded.choice.correct':
          'You listened to a different idea.',
        'missions.be-open-minded.choice.retry':
          'Try to learn more before you choose.',
        'missions.be-open-minded.reflection.prompt':
          'When can you listen to a new idea?',
        'missions.be-open-minded.reflection.sentence-starter':
          'I can listen when…',
        'missions.be-open-minded.reward.title': 'Open-Minded Stamp',
        'missions.be-open-minded.reward.body': 'You listened before you chose.',
      },
    },
  ],
} satisfies ContentRegistry
