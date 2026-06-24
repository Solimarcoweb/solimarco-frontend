import { lazy, Suspense, type JSX, type LazyExoticComponent } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouteFallback } from './RouteFallback'

// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const HomePage = lazy(() => import('./pages/HomePage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const ConstruccionPage = lazy(() => import('./pages/construccion/ConstruccionPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const RestauranteLandingPage = lazy(
  () => import('./pages/restaurante-landing/RestauranteLandingPage'),
)
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const RestauranteLayout = lazy(() => import('./pages/restaurante-multi/RestauranteLayout'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const RestauranteHomePage = lazy(() => import('./pages/restaurante-multi/RestauranteHomePage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const RestauranteCartaPage = lazy(() => import('./pages/restaurante-multi/RestauranteCartaPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const RestauranteReservasPage = lazy(
  () => import('./pages/restaurante-multi/RestauranteReservasPage'),
)
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const RestauranteContactoPage = lazy(
  () => import('./pages/restaurante-multi/RestauranteContactoPage'),
)

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
  {
    path: '/restaurante',
    element: withSuspense(RestauranteLandingPage),
  },
  {
    path: '/restaurante-multi',
    element: withSuspense(RestauranteLayout),
    children: [
      { index: true, element: withSuspense(RestauranteHomePage) },
      { path: 'carta', element: withSuspense(RestauranteCartaPage) },
      { path: 'reservas', element: withSuspense(RestauranteReservasPage) },
      { path: 'contacto', element: withSuspense(RestauranteContactoPage) },
    ],
  },
])
