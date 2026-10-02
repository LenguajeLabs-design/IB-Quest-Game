import { createHashRouter } from 'react-router-dom'
import { MissionGame } from '../features/mission/MissionGame'
import { App, HomePage, PlaceholderPage } from './App'

export const router = createHashRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'mission/:missionId', element: <MissionGame /> },
      {
        path: 'words',
        element: <PlaceholderPage icon="💬" title="My Words" />,
      },
      { path: 'badges', element: <PlaceholderPage icon="⭐" title="Badges" /> },
      {
        path: 'journey',
        element: <PlaceholderPage icon="🗺️" title="My Journey" />,
      },
      { path: '*', element: <PlaceholderPage title="Trail not found" /> },
    ],
  },
])
