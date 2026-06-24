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
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const MecanicoLandingPage = lazy(() => import('./pages/mecanico-landing/MecanicoLandingPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const MecanicoLayout = lazy(() => import('./pages/mecanico-multi/MecanicoLayout'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const MecanicoHomePage = lazy(() => import('./pages/mecanico-multi/MecanicoHomePage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const MecanicoServiciosPage = lazy(() => import('./pages/mecanico-multi/MecanicoServiciosPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const MecanicoCitaPage = lazy(() => import('./pages/mecanico-multi/MecanicoCitaPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const MecanicoContactoPage = lazy(() => import('./pages/mecanico-multi/MecanicoContactoPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const TiendaLandingPage = lazy(() => import('./pages/tienda-landing/TiendaLandingPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const TiendaLayout = lazy(() => import('./pages/tienda-multi/TiendaLayout'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const TiendaHomePage = lazy(() => import('./pages/tienda-multi/TiendaHomePage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const TiendaProductosPage = lazy(() => import('./pages/tienda-multi/TiendaProductosPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const TiendaCarritoPage = lazy(() => import('./pages/tienda-multi/TiendaCarritoPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const TiendaContactoPage = lazy(() => import('./pages/tienda-multi/TiendaContactoPage'))

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
  {
    path: '/mecanico',
    element: withSuspense(MecanicoLandingPage),
  },
  {
    path: '/mecanico-multi',
    element: withSuspense(MecanicoLayout),
    children: [
      { index: true, element: withSuspense(MecanicoHomePage) },
      { path: 'servicios', element: withSuspense(MecanicoServiciosPage) },
      { path: 'cita', element: withSuspense(MecanicoCitaPage) },
      { path: 'contacto', element: withSuspense(MecanicoContactoPage) },
    ],
  },
  {
    path: '/tienda',
    element: withSuspense(TiendaLandingPage),
  },
  {
    path: '/tienda-multi',
    element: withSuspense(TiendaLayout),
    children: [
      { index: true, element: withSuspense(TiendaHomePage) },
      { path: 'productos', element: withSuspense(TiendaProductosPage) },
      { path: 'carrito', element: withSuspense(TiendaCarritoPage) },
      { path: 'contacto', element: withSuspense(TiendaContactoPage) },
    ],
  },
])
