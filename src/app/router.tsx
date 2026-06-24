import { lazy, Suspense, type JSX, type LazyExoticComponent } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouteFallback } from './RouteFallback'
import TenantRouter from '../core/tenant/TenantRouter'
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
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const EsteticaLandingPage = lazy(() => import('./pages/estetica-landing/EsteticaLandingPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const EsteticaLayout = lazy(() => import('./pages/estetica-multi/EsteticaLayout'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const EsteticaHomePage = lazy(() => import('./pages/estetica-multi/EsteticaHomePage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const EsteticaTratamientosPage = lazy(() => import('./pages/estetica-multi/EsteticaTratamientosPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const EsteticaCitaPage = lazy(() => import('./pages/estetica-multi/EsteticaCitaPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const EsteticaContactoPage = lazy(() => import('./pages/estetica-multi/EsteticaContactoPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const PeluqueriaLandingPage = lazy(() => import('./pages/peluqueria-landing/PeluqueriaLandingPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const PeluqueriaLayout = lazy(() => import('./pages/peluqueria-multi/PeluqueriaLayout'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const PeluqueriaHomePage = lazy(() => import('./pages/peluqueria-multi/PeluqueriaHomePage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const PeluqueriaServiciosPage = lazy(() => import('./pages/peluqueria-multi/PeluqueriaServiciosPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const PeluqueriaCitaPage = lazy(() => import('./pages/peluqueria-multi/PeluqueriaCitaPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const PeluqueriaContactoPage = lazy(() => import('./pages/peluqueria-multi/PeluqueriaContactoPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const GenericoLandingPage = lazy(() => import('./pages/generico-landing/GenericoLandingPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const GenericoLayout = lazy(() => import('./pages/generico-multi/GenericoLayout'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const GenericoHomePage = lazy(() => import('./pages/generico-multi/GenericoHomePage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const GenericoServiciosPage = lazy(() => import('./pages/generico-multi/GenericoServiciosPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const GenericoPresupuestoPage = lazy(() => import('./pages/generico-multi/GenericoPresupuestoPage'))
// eslint-disable-next-line react-refresh/only-export-components -- this module exports the router config, not a component
const GenericoContactoPage = lazy(() => import('./pages/generico-multi/GenericoContactoPage'))

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
    // Splat required so descendant <Routes> inside TenantRouter can match sub-paths
    // in the data-router context (React Router requires a /* parent for descendant Routes).
    path: '/*',
    element: <TenantRouter />,
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
  {
    path: '/estetica',
    element: withSuspense(EsteticaLandingPage),
  },
  {
    path: '/estetica-multi',
    element: withSuspense(EsteticaLayout),
    children: [
      { index: true, element: withSuspense(EsteticaHomePage) },
      { path: 'tratamientos', element: withSuspense(EsteticaTratamientosPage) },
      { path: 'cita', element: withSuspense(EsteticaCitaPage) },
      { path: 'contacto', element: withSuspense(EsteticaContactoPage) },
    ],
  },
  {
    path: '/peluqueria',
    element: withSuspense(PeluqueriaLandingPage),
  },
  {
    path: '/peluqueria-multi',
    element: withSuspense(PeluqueriaLayout),
    children: [
      { index: true, element: withSuspense(PeluqueriaHomePage) },
      { path: 'servicios', element: withSuspense(PeluqueriaServiciosPage) },
      { path: 'cita', element: withSuspense(PeluqueriaCitaPage) },
      { path: 'contacto', element: withSuspense(PeluqueriaContactoPage) },
    ],
  },
  {
    path: '/generico',
    element: withSuspense(GenericoLandingPage),
  },
  {
    path: '/generico-multi',
    element: withSuspense(GenericoLayout),
    children: [
      { index: true, element: withSuspense(GenericoHomePage) },
      { path: 'servicios', element: withSuspense(GenericoServiciosPage) },
      { path: 'presupuesto', element: withSuspense(GenericoPresupuestoPage) },
      { path: 'contacto', element: withSuspense(GenericoContactoPage) },
    ],
  },
])
