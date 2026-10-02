import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { contentRegistry, getContentCopy } from '../content/registry'
import styles from './App.module.css'

const navigationItems = [
  { label: 'Home', icon: '🏠', to: '/' },
  { label: 'My Words', icon: '💬', to: '/words' },
  { label: 'Badges', icon: '⭐', to: '/badges' },
  { label: 'My Journey', icon: '🗺️', to: '/journey' },
] as const

function BottomNavigation() {
  return (
    <nav className={styles.bottomNav} aria-label="Quest navigation">
      {navigationItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
          }
          end={item.to === '/'}
          key={item.to}
          to={item.to}
        >
          <span className={styles.navIcon} aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function App() {
  const location = useLocation()
  const isMission = location.pathname.startsWith('/mission/')

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <Outlet />
      {isMission ? null : <BottomNavigation />}
    </div>
  )
}

function speakWelcome() {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const message = new SpeechSynthesisUtterance(
    'Welcome, Explorer. Your next mission is Be Open-Minded.',
  )
  message.lang = 'en'
  message.rate = 0.82
  window.speechSynthesis.speak(message)
}

export function HomePage() {
  const [simpleEnglish, setSimpleEnglish] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const mission = contentRegistry.missions[0]

  if (!mission) {
    throw new Error('The content registry does not contain a starting mission.')
  }

  return (
    <main className={styles.homePage} id="main-content">
      <h1 className="sr-only">Where will your curiosity lead?</h1>
      <section className={styles.mapViewport} aria-labelledby="map-title">
        <div className={styles.mapFrame}>
          <picture className={styles.mapArt} aria-hidden="true">
            <source
              media="(max-width: 900px)"
              srcSet={`${import.meta.env.BASE_URL}art/quest-world-1024.jpg`}
            />
            <img
              alt=""
              fetchPriority="high"
              src={`${import.meta.env.BASE_URL}art/quest-world.jpg`}
            />
          </picture>

          <header className={styles.gameHeader}>
            <div className={styles.explorerCard}>
              <span className={styles.avatar} aria-hidden="true">
                🧭
              </span>
              <div>
                <p>Welcome,</p>
                <strong>Explorer!</strong>
                <div className={styles.levelRow}>
                  <span aria-hidden="true">⭐</span>
                  <div
                    className={styles.levelTrack}
                    role="progressbar"
                    aria-label="Explorer level progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={28}
                  >
                    <span />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.gameLogo} aria-label="IB Quest">
              <span aria-hidden="true">✦</span>
              <strong>IB</strong> <em>Quest</em>
            </div>

            <div className={styles.headerControls}>
              <button
                className={styles.languageButton}
                type="button"
                aria-pressed={simpleEnglish}
                onClick={() => setSimpleEnglish((value) => !value)}
              >
                <span aria-hidden="true">🌐</span>
                <span>{simpleEnglish ? 'Simple' : 'English'}</span>
              </button>
              <button
                className={styles.roundButton}
                type="button"
                aria-label="Hear welcome message"
                onClick={speakWelcome}
              >
                🔊
              </button>
              <button
                className={styles.roundButton}
                type="button"
                aria-expanded={helpOpen}
                aria-label="Show map help"
                onClick={() => setHelpOpen((value) => !value)}
              >
                ?
              </button>
            </div>
          </header>

          <h2 className="sr-only" id="map-title">
            Learning regions
          </h2>

          <Link
            className={`${styles.destination} ${styles.peaksDestination}`}
            to={`/mission/${mission.id}`}
          >
            <span aria-hidden="true">⛰️</span>
            Learner Profile Peaks
            <small>Start here</small>
          </Link>
          <button
            className={`${styles.destination} ${styles.labDestination}`}
            type="button"
            disabled
          >
            <span aria-hidden="true">💡</span>
            ATL Skills Lab
            <small>Coming soon</small>
          </button>
          <button
            className={`${styles.destination} ${styles.riverDestination}`}
            type="button"
            disabled
          >
            <span aria-hidden="true">❓</span>
            Inquiry River
            <small>Coming soon</small>
          </button>
          <button
            className={`${styles.destination} ${styles.compassDestination}`}
            type="button"
            disabled
          >
            <span aria-hidden="true">🧭</span>
            Concept Compass
            <small>Coming soon</small>
          </button>

          {helpOpen ? (
            <aside className={styles.helpBubble} aria-live="polite">
              <strong>How to explore</strong>
              <p>Follow the glowing trail. Choose a white destination label.</p>
            </aside>
          ) : null}

          <article className={styles.nextMission}>
            <div className={styles.missionStamp} aria-hidden="true">
              <span>★</span>
            </div>
            <div className={styles.missionCopy}>
              <p>Your next mission</p>
              <h2>{getContentCopy(mission.titleKey)}</h2>
              <span>
                {getContentCopy(
                  mission.objectiveKey,
                  simpleEnglish ? 'simple' : 'standard',
                )}
              </span>
              <Link to={`/mission/${mission.id}`}>
                Continue <span aria-hidden="true">›</span>
              </Link>
            </div>
          </article>
        </div>
      </section>
      <p className={styles.scrollHint}>
        Swipe sideways to explore the whole map.
      </p>
    </main>
  )
}

type PlaceholderPageProps = {
  title: string
  icon?: string
}

export function PlaceholderPage({ icon = '🧭', title }: PlaceholderPageProps) {
  return (
    <main className={styles.placeholderPage} id="main-content">
      <section className={styles.placeholderCard}>
        <span className={styles.placeholderIcon} aria-hidden="true">
          {icon}
        </span>
        <p className={styles.placeholderKicker}>The trail continues soon</p>
        <h1>{title}</h1>
        <p>This part of the world will open in the next build.</p>
        <Link to="/">Back to the world map</Link>
      </section>
    </main>
  )
}
