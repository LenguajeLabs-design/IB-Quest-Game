import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MissionGame } from './MissionGame'

function renderMission() {
  const router = createMemoryRouter(
    [{ path: '/mission/:missionId', element: <MissionGame /> }],
    { initialEntries: ['/mission/be-open-minded'] },
  )
  return render(<RouterProvider router={router} />)
}

describe('Be Open-Minded mission', () => {
  it('completes the six-step learning loop', async () => {
    const user = userEvent.setup()
    renderMission()

    expect(
      screen.getByText(/two classmates have different ideas/i),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /let’s help them/i }))

    expect(screen.getByText('Open-minded')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: /show simple english/i }),
    )
    expect(
      screen.getByText('Listen to ideas that are different from your idea.'),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /i understand/i }))

    expect(screen.getByText(/which response makes room/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /try a choice/i }))

    await user.click(screen.getByRole('button', { name: /already better/i }))
    expect(
      screen.getByText(/try a response that helps you learn more/i),
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: /explain their thinking/i }),
    )
    expect(
      screen.getByText(/helps you understand another point of view/i),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /keep exploring/i }))

    const reflection = screen.getByRole('textbox')
    await user.type(reflection, 'a classmate shares a new idea')
    await user.click(screen.getByRole('button', { name: /finish my mission/i }))

    expect(screen.getByText('Mission complete!')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Open-Minded Stamp' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /return to the world map/i }),
    ).toBeInTheDocument()
  })
})
