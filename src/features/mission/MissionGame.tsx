import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { contentRegistry, getContentCopy } from '../../content/registry'
import type { MissionStep } from '../../content/schemas/mission'
import styles from './MissionGame.module.css'

type StepContentProps = {
  onReady: () => void
  step: MissionStep
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const message = new SpeechSynthesisUtterance(text)
  message.lang = 'en'
  message.rate = 0.82
  window.speechSynthesis.speak(message)
}

function StoryStep({ onReady, step }: StepContentProps) {
  if (step.type !== 'story') return null

  return (
    <div className={styles.storyScene}>
      <span className={styles.character} aria-hidden="true">
        🧒🏽
      </span>
      <div className={styles.speechBubble}>
        <p>{getContentCopy(step.bodyKey)}</p>
        <p>
          One learner wants a mountain poster. The other wants an ocean poster.
          They need one project together.
        </p>
      </div>
      <button className={styles.primaryButton} type="button" onClick={onReady}>
        Let’s help them <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}

function TermStep({ onReady, step }: StepContentProps) {
  const [simple, setSimple] = useState(false)
  if (step.type !== 'term') return null

  const definition = getContentCopy(
    step.definitionKey,
    simple ? 'simple' : 'standard',
  )

  return (
    <div className={styles.centeredStep}>
      <p className={styles.stepKicker}>Today’s power word</p>
      <button
        className={styles.wordButton}
        type="button"
        onClick={() => speak(getContentCopy(step.termKey))}
      >
        <span>{getContentCopy(step.termKey)}</span>
        <span aria-hidden="true">🔊</span>
      </button>
      <p className={styles.definition}>{definition}</p>
      <button
        className={styles.simpleToggle}
        type="button"
        aria-pressed={simple}
        onClick={() => setSimple((value) => !value)}
      >
        {simple ? 'Show full English' : 'Show Simple English'}
      </button>
      <button className={styles.primaryButton} type="button" onClick={onReady}>
        I understand <span aria-hidden="true">✓</span>
      </button>
    </div>
  )
}

function ComparisonStep({ onReady, step }: StepContentProps) {
  if (step.type !== 'exampleComparison') return null

  return (
    <div>
      <p className={styles.stepKicker}>{getContentCopy(step.promptKey)}</p>
      <div className={styles.comparisonGrid}>
        <article className={styles.exampleCard}>
          <span aria-hidden="true">🌟</span>
          <h2>Open-minded</h2>
          <p>“{getContentCopy(step.exampleKey)}”</p>
        </article>
        <article className={styles.nonExampleCard}>
          <span aria-hidden="true">🧱</span>
          <h2>Not yet</h2>
          <p>“{getContentCopy(step.nonExampleKey)}”</p>
        </article>
      </div>
      <button className={styles.primaryButton} type="button" onClick={onReady}>
        Try a choice <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}

function ChoiceStep({ onReady, step }: StepContentProps) {
  const [selected, setSelected] = useState<string | null>(null)
  if (step.type !== 'choice') return null

  const isCorrect = selected === step.correctOptionId
  const feedback = selected
    ? getContentCopy(
        isCorrect ? step.correctFeedbackKey : step.retryFeedbackKey,
      )
    : null

  return (
    <div>
      <p className={styles.choicePrompt}>{getContentCopy(step.promptKey)}</p>
      <div className={styles.choiceGrid}>
        {step.options.map((option, index) => (
          <button
            className={`${styles.choiceButton} ${
              selected === option.id ? styles.choiceSelected : ''
            }`}
            key={option.id}
            type="button"
            aria-pressed={selected === option.id}
            onClick={() => setSelected(option.id)}
          >
            <span className={styles.choiceLetter} aria-hidden="true">
              {String.fromCharCode(65 + index)}
            </span>
            <span>{getContentCopy(option.labelKey)}</span>
          </button>
        ))}
      </div>
      <div className={styles.feedback} aria-live="polite">
        {feedback ? (
          <p>
            <span aria-hidden="true">{isCorrect ? '✨' : '💡'}</span> {feedback}
          </p>
        ) : (
          <p>Choose the response you would try first.</p>
        )}
      </div>
      {isCorrect ? (
        <button
          className={styles.primaryButton}
          type="button"
          onClick={onReady}
        >
          Keep exploring <span aria-hidden="true">→</span>
        </button>
      ) : null}
    </div>
  )
}

function ReflectionStep({ onReady, step }: StepContentProps) {
  const [reflection, setReflection] = useState('')
  if (step.type !== 'reflection') return null

  return (
    <div className={styles.reflectionStep}>
      <span className={styles.bigIcon} aria-hidden="true">
        💭
      </span>
      <p className={styles.choicePrompt}>{getContentCopy(step.promptKey)}</p>
      <label className={styles.reflectionLabel}>
        <span>{getContentCopy(step.sentenceStarterKey)}</span>
        <textarea
          rows={3}
          value={reflection}
          maxLength={180}
          placeholder="Type an idea, or continue when you are ready."
          onChange={(event) => setReflection(event.target.value)}
        />
      </label>
      <p className={styles.privacyNote}>
        This practice answer stays on this screen and is not saved.
      </p>
      <button className={styles.primaryButton} type="button" onClick={onReady}>
        Finish my mission <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}

function RewardStep({ step }: { step: MissionStep }) {
  if (step.type !== 'reward') return null

  return (
    <div className={styles.rewardStep}>
      <div className={styles.rewardBadge} aria-hidden="true">
        <span>★</span>
      </div>
      <p className={styles.stepKicker}>Mission complete!</p>
      <h2>{getContentCopy(step.titleKey)}</h2>
      <p>{getContentCopy(step.bodyKey)}</p>
      <Link className={styles.primaryButton} to="/">
        Return to the world map <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

function StepContent({ onReady, step }: StepContentProps) {
  switch (step.type) {
    case 'story':
      return <StoryStep step={step} onReady={onReady} />
    case 'term':
      return <TermStep step={step} onReady={onReady} />
    case 'exampleComparison':
      return <ComparisonStep step={step} onReady={onReady} />
    case 'choice':
      return <ChoiceStep step={step} onReady={onReady} />
    case 'reflection':
      return <ReflectionStep step={step} onReady={onReady} />
    case 'reward':
      return <RewardStep step={step} />
  }
}

export function MissionGame() {
  const { missionId } = useParams()
  const mission = useMemo(
    () => contentRegistry.missions.find(({ id }) => id === missionId),
    [missionId],
  )
  const [stepIndex, setStepIndex] = useState(0)

  if (!mission) {
    return (
      <main className={styles.missionPage} id="main-content">
        <section className={styles.missionCard}>
          <h1>That mission is not on the map yet.</h1>
          <Link className={styles.primaryButton} to="/">
            Return to the world map
          </Link>
        </section>
      </main>
    )
  }

  const activeStep = mission.steps[stepIndex]
  if (!activeStep) return null

  const progress = ((stepIndex + 1) / mission.steps.length) * 100

  return (
    <main className={styles.missionPage} id="main-content">
      <div className={styles.missionTopbar}>
        <Link className={styles.backLink} to="/" aria-label="Leave mission">
          ← <span>Map</span>
        </Link>
        <div className={styles.missionIdentity}>
          <span className={styles.miniBadge} aria-hidden="true">
            △
          </span>
          <div>
            <p>Learner Profile Peaks</p>
            <strong>{getContentCopy(mission.titleKey)}</strong>
          </div>
        </div>
        <p className={styles.stepCount}>
          {stepIndex + 1} / {mission.steps.length}
        </p>
      </div>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Mission progress"
        aria-valuemin={0}
        aria-valuemax={mission.steps.length}
        aria-valuenow={stepIndex + 1}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className={styles.missionCard} aria-live="polite">
        <StepContent
          key={activeStep.id}
          step={activeStep}
          onReady={() =>
            setStepIndex((index) =>
              Math.min(index + 1, mission.steps.length - 1),
            )
          }
        />
      </section>
    </main>
  )
}
