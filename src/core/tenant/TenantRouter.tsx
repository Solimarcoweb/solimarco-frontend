import { lazy, Suspense, type JSX } from 'react'
import { Route, Routes } from 'react-router'
import { RouteFallback } from '../../app/RouteFallback'
import { useTenantConfig } from './TenantContext'
import type { TenantConfig } from './tenantConfig'

// ─── Construcción ────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
const ConstruccionLandingPage = lazy(
  () => import('../../app/pages/construccion/ConstruccionLandingPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const ConstruccionLayout = lazy(() => import('../../app/pages/construccion-multi/ConstruccionLayout'))
// eslint-disable-next-line react-refresh/only-export-components
const ConstruccionHomePage = lazy(
  () => import('../../app/pages/construccion-multi/ConstruccionHomePage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const ConstruccionServiciosPage = lazy(
  () => import('../../app/pages/construccion-multi/ConstruccionServiciosPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const ConstruccionProyectosPage = lazy(
  () => import('../../app/pages/construccion-multi/ConstruccionProyectosPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const ConstruccionShowroomPage = lazy(
  () => import('../../app/pages/construccion-multi/ConstruccionShowroomPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const ConstruccionContactoPage = lazy(
  () => import('../../app/pages/construccion-multi/ConstruccionContactoPage'),
)

// ─── Restaurante ─────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
const RestauranteLandingPage = lazy(
  () => import('../../app/pages/restaurante-landing/RestauranteLandingPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const RestauranteLayout = lazy(
  () => import('../../app/pages/restaurante-multi/RestauranteLayout'),
)
// eslint-disable-next-line react-refresh/only-export-components
const RestauranteHomePage = lazy(
  () => import('../../app/pages/restaurante-multi/RestauranteHomePage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const RestauranteCartaPage = lazy(
  () => import('../../app/pages/restaurante-multi/RestauranteCartaPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const RestauranteReservasPage = lazy(
  () => import('../../app/pages/restaurante-multi/RestauranteReservasPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const RestauranteContactoPage = lazy(
  () => import('../../app/pages/restaurante-multi/RestauranteContactoPage'),
)

// ─── Mecánico ─────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
const MecanicoLandingPage = lazy(
  () => import('../../app/pages/mecanico-landing/MecanicoLandingPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const MecanicoLayout = lazy(() => import('../../app/pages/mecanico-multi/MecanicoLayout'))
// eslint-disable-next-line react-refresh/only-export-components
const MecanicoHomePage = lazy(() => import('../../app/pages/mecanico-multi/MecanicoHomePage'))
// eslint-disable-next-line react-refresh/only-export-components
const MecanicoServiciosPage = lazy(
  () => import('../../app/pages/mecanico-multi/MecanicoServiciosPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const MecanicoCitaPage = lazy(() => import('../../app/pages/mecanico-multi/MecanicoCitaPage'))
// eslint-disable-next-line react-refresh/only-export-components
const MecanicoContactoPage = lazy(
  () => import('../../app/pages/mecanico-multi/MecanicoContactoPage'),
)

// ─── Tienda ───────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
const TiendaLandingPage = lazy(() => import('../../app/pages/tienda-landing/TiendaLandingPage'))
// eslint-disable-next-line react-refresh/only-export-components
const TiendaLayout = lazy(() => import('../../app/pages/tienda-multi/TiendaLayout'))
// eslint-disable-next-line react-refresh/only-export-components
const TiendaHomePage = lazy(() => import('../../app/pages/tienda-multi/TiendaHomePage'))
// eslint-disable-next-line react-refresh/only-export-components
const TiendaProductosPage = lazy(
  () => import('../../app/pages/tienda-multi/TiendaProductosPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const TiendaCarritoPage = lazy(() => import('../../app/pages/tienda-multi/TiendaCarritoPage'))
// eslint-disable-next-line react-refresh/only-export-components
const TiendaContactoPage = lazy(() => import('../../app/pages/tienda-multi/TiendaContactoPage'))

// ─── Estética ─────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
const EsteticaLandingPage = lazy(
  () => import('../../app/pages/estetica-landing/EsteticaLandingPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const EsteticaLayout = lazy(() => import('../../app/pages/estetica-multi/EsteticaLayout'))
// eslint-disable-next-line react-refresh/only-export-components
const EsteticaHomePage = lazy(() => import('../../app/pages/estetica-multi/EsteticaHomePage'))
// eslint-disable-next-line react-refresh/only-export-components
const EsteticaTratamientosPage = lazy(
  () => import('../../app/pages/estetica-multi/EsteticaTratamientosPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const EsteticaCitaPage = lazy(() => import('../../app/pages/estetica-multi/EsteticaCitaPage'))
// eslint-disable-next-line react-refresh/only-export-components
const EsteticaContactoPage = lazy(
  () => import('../../app/pages/estetica-multi/EsteticaContactoPage'),
)

// ─── Peluquería ───────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
const PeluqueriaLandingPage = lazy(
  () => import('../../app/pages/peluqueria-landing/PeluqueriaLandingPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const PeluqueriaLayout = lazy(() => import('../../app/pages/peluqueria-multi/PeluqueriaLayout'))
// eslint-disable-next-line react-refresh/only-export-components
const PeluqueriaHomePage = lazy(
  () => import('../../app/pages/peluqueria-multi/PeluqueriaHomePage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const PeluqueriaServiciosPage = lazy(
  () => import('../../app/pages/peluqueria-multi/PeluqueriaServiciosPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const PeluqueriaCitaPage = lazy(
  () => import('../../app/pages/peluqueria-multi/PeluqueriaCitaPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const PeluqueriaContactoPage = lazy(
  () => import('../../app/pages/peluqueria-multi/PeluqueriaContactoPage'),
)

// ─── Genérico ─────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
const GenericoLandingPage = lazy(
  () => import('../../app/pages/generico-landing/GenericoLandingPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const GenericoLayout = lazy(() => import('../../app/pages/generico-multi/GenericoLayout'))
// eslint-disable-next-line react-refresh/only-export-components
const GenericoHomePage = lazy(() => import('../../app/pages/generico-multi/GenericoHomePage'))
// eslint-disable-next-line react-refresh/only-export-components
const GenericoServiciosPage = lazy(
  () => import('../../app/pages/generico-multi/GenericoServiciosPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const GenericoPresupuestoPage = lazy(
  () => import('../../app/pages/generico-multi/GenericoPresupuestoPage'),
)
// eslint-disable-next-line react-refresh/only-export-components
const GenericoContactoPage = lazy(
  () => import('../../app/pages/generico-multi/GenericoContactoPage'),
)

// Global legal route, shared by every sector (not sector-specific).
const LegalPageRoute = lazy(
  () => import('../../modules/legal/components/LegalPageRoute/LegalPageRoute'),
)

// ─────────────────────────────────────────────────────────────────────────────

/** Inline Routes element for each multi-page sector. */
function ConstruccionMulti(): JSX.Element {
  return (
    <Routes>
      <Route element={<ConstruccionLayout />}>
        <Route index element={<ConstruccionHomePage />} />
        <Route path="servicios" element={<ConstruccionServiciosPage />} />
        <Route path="proyectos" element={<ConstruccionProyectosPage />} />
        <Route path="showroom" element={<ConstruccionShowroomPage />} />
        <Route path="contacto" element={<ConstruccionContactoPage />} />
      </Route>
    </Routes>
  )
}

function RestauranteMulti(): JSX.Element {
  return (
    <Routes>
      <Route element={<RestauranteLayout />}>
        <Route index element={<RestauranteHomePage />} />
        <Route path="carta" element={<RestauranteCartaPage />} />
        <Route path="reservas" element={<RestauranteReservasPage />} />
        <Route path="contacto" element={<RestauranteContactoPage />} />
      </Route>
    </Routes>
  )
}

function MecanicoMulti(): JSX.Element {
  return (
    <Routes>
      <Route element={<MecanicoLayout />}>
        <Route index element={<MecanicoHomePage />} />
        <Route path="servicios" element={<MecanicoServiciosPage />} />
        <Route path="cita" element={<MecanicoCitaPage />} />
        <Route path="contacto" element={<MecanicoContactoPage />} />
      </Route>
    </Routes>
  )
}

function TiendaMulti(): JSX.Element {
  return (
    <Routes>
      <Route element={<TiendaLayout />}>
        <Route index element={<TiendaHomePage />} />
        <Route path="productos" element={<TiendaProductosPage />} />
        <Route path="carrito" element={<TiendaCarritoPage />} />
        <Route path="contacto" element={<TiendaContactoPage />} />
      </Route>
    </Routes>
  )
}

function EsteticaMulti(): JSX.Element {
  return (
    <Routes>
      <Route element={<EsteticaLayout />}>
        <Route index element={<EsteticaHomePage />} />
        <Route path="tratamientos" element={<EsteticaTratamientosPage />} />
        <Route path="cita" element={<EsteticaCitaPage />} />
        <Route path="contacto" element={<EsteticaContactoPage />} />
      </Route>
    </Routes>
  )
}

function PeluqueriaMulti(): JSX.Element {
  return (
    <Routes>
      <Route element={<PeluqueriaLayout />}>
        <Route index element={<PeluqueriaHomePage />} />
        <Route path="servicios" element={<PeluqueriaServiciosPage />} />
        <Route path="cita" element={<PeluqueriaCitaPage />} />
        <Route path="contacto" element={<PeluqueriaContactoPage />} />
      </Route>
    </Routes>
  )
}

function GenericoMulti(): JSX.Element {
  return (
    <Routes>
      <Route element={<GenericoLayout />}>
        <Route index element={<GenericoHomePage />} />
        <Route path="servicios" element={<GenericoServiciosPage />} />
        <Route path="presupuesto" element={<GenericoPresupuestoPage />} />
        <Route path="contacto" element={<GenericoContactoPage />} />
      </Route>
    </Routes>
  )
}

function resolveContent(sector: string, siteType: TenantConfig['siteType']): JSX.Element {
  switch (sector) {
    case 'construccion':
      return siteType === 'FULL' ? <ConstruccionMulti /> : <ConstruccionLandingPage />

    case 'restaurante':
      return siteType === 'FULL' ? <RestauranteMulti /> : <RestauranteLandingPage />

    case 'mecanico':
      return siteType === 'FULL' ? <MecanicoMulti /> : <MecanicoLandingPage />

    case 'tienda':
      return siteType === 'FULL' ? <TiendaMulti /> : <TiendaLandingPage />

    case 'estetica':
      return siteType === 'FULL' ? <EsteticaMulti /> : <EsteticaLandingPage />

    case 'peluqueria':
      return siteType === 'FULL' ? <PeluqueriaMulti /> : <PeluqueriaLandingPage />

    case 'generico':
      return siteType === 'FULL' ? <GenericoMulti /> : <GenericoLandingPage />

    default:
      return <GenericoLandingPage />
  }
}

/**
 * Reads the resolved tenant configuration from context and renders the
 * correct page tree: the global `/legal/:slug` route (shared by every sector)
 * first, then a single landing page for `siteType === 'LANDING'` or a nested
 * `<Routes>` layout with sub-pages for `siteType === 'FULL'` as the fallback.
 *
 * Must be mounted under a splat route (`path: '/*'`) so that descendant
 * `<Routes>` can match sub-paths in the data-router context.
 */
export default function TenantRouter(): JSX.Element {
  const { sector, siteType } = useTenantConfig()

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="legal/:slug" element={<LegalPageRoute />} />
        <Route path="*" element={resolveContent(sector, siteType)} />
      </Routes>
    </Suspense>
  )
}
