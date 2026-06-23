import { RouterProvider } from 'react-router'
import { AppProviders } from './AppProviders'
import { router } from './router'

/**
 * Root application component: mounts global providers (Helmet, i18n) and the router.
 */
export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
