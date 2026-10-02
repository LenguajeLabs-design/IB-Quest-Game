import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const defaultNamespace = 'ui'

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: defaultNamespace,
  interpolation: { escapeValue: false },
  resources: {
    en: {
      ui: {
        skipToContent: 'Skip to content',
        eyebrow: 'Your learning world',
        title: 'Where will your curiosity lead?',
        intro:
          'Explore four regions. Each short mission helps you notice, ask, think, and act.',
        phaseLabel: 'Foundation build',
        phaseStatus: 'In progress',
        draftLabel: 'Draft content',
        regionsHeading: 'Learning regions',
        cycleHeading: 'Our inquiry path',
        missionHeading: 'Next mission',
        startMission: 'Preview mission',
        comingSoon: 'Coming soon',
        available: 'Ready to explore',
        contentNotice:
          'School wording and language choices are still awaiting approval.',
        navigationLabel: 'Quest navigation',
        home: 'Home',
        words: 'My Words',
        badges: 'Badges',
        journey: 'My Journey',
        routePlaceholder: 'This foundation route is ready for its MVP feature.',
        backHome: 'Back to the map',
      },
    },
  },
})

export default i18n
