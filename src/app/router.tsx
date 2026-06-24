import { lazy, Suspense, type JSX, type LazyExoticComponent } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouteFallback } from './RouteFallback'

// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const HomePage = lazy(() => import('./pages/HomePage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const ConstruccionPage = lazy(() => import('./pages/construccion/ConstruccionPage'))

function withSuspense(Component: LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  )
}

/**
 * Application router. Every route is lazy-loaded with `React.lazy` so route
 * bundles are split from the start instead of being optimized later.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(HomePage),
  },
  {
    path: '/construccion',
    element: withSuspense(ConstruccionPage),
  },
])
