import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MissionGame } from '../features/mission/MissionGame'
import { App, HomePage, PlaceholderPage } from './App'

function renderApp(initialEntry = '/') {
  const router = createMemoryRouter(
    [
      {
        element: <App />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'mission/:missionId', element: <MissionGame /> },
          { path: 'words', element: <PlaceholderPage title="My Words" /> },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('IB Quest app shell', () => {
  it('renders the foundation Home experience from validated content', () => {
    renderApp()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /where will your curiosity lead/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /learning regions/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Learner Profile Peaks')).toBeInTheDocument()
    expect(screen.getByText('Be Open-Minded')).toBeInTheDocument()

    const navigation = screen.getByRole('navigation', {
      name: /quest navigation/i,
    })
    expect(within(navigation).getAllByRole('link')).toHaveLength(4)
  })

  it('renders a routed foundation placeholder', () => {
    renderApp('/words')

    expect(
      screen.getByRole('heading', { level: 1, name: 'My Words' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /back to the world map/i }),
    ).toHaveAttribute('href', '/')
  })

  it('resolves known and unknown mission routes', () => {
    const { unmount } = renderApp('/mission/be-open-minded')

    expect(screen.getByText('Be Open-Minded')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /leave mission/i }),
    ).toBeInTheDocument()

    unmount()
    renderApp('/mission/not-a-mission')

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /that mission is not on the map yet/i,
      }),
    ).toBeInTheDocument()
  })
})
