import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import ConstruccionLayout from './ConstruccionLayout'
import ConstruccionHomePage from './ConstruccionHomePage'
import ConstruccionServiciosPage from './ConstruccionServiciosPage'
import ConstruccionProyectosPage from './ConstruccionProyectosPage'
import ConstruccionShowroomPage from './ConstruccionShowroomPage'
import ConstruccionContactoPage from './ConstruccionContactoPage'

const config: TenantConfig = {
  tenantId: 'bm-construccion',
  businessName: 'BM Construcción S.L.',
  themeName: 'clasico',
  siteType: 'FULL',
  sector: 'construccion',
  locale: 'es',
  businessDescription: 'Reformas y obra nueva en Tenerife.',
  phone: '+34 922 65 41 30',
  email: 'info@bmconstruccionsl.com',
  address: 'Calle La Hornera 48, La Laguna',
  socialLinks: { instagram: 'https://instagram.com/bm' },
  modules: { hasShop: false, hasReservations: false, hasCitas: false, hasBudgetForm: true },
}

vi.mock('../../../core/tenant/TenantContext', () => ({
  useTenantConfig: () => config,
  useOptionalTenantConfig: () => config,
}))
vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({ usePageTracking: () => {} }))

const servicesData = [
  {
    id: 'obra-nueva',
    name: 'Obra nueva',
    description: 'Llave en mano.',
    imageUrl: 'https://example.com/o.jpg',
    displayOrder: 1,
  },
  {
    id: 'reformas',
    name: 'Reformas integrales',
    description: 'Modernizamos espacios.',
    imageUrl: 'https://example.com/r.jpg',
    displayOrder: 2,
  },
]

const projectsData = [
  {
    id: 'villa',
    name: 'Villa Puerto de Santiago',
    description: 'Obra nueva.',
    imageUrl: 'https://example.com/v.jpg',
    category: 'Obra nueva',
    displayOrder: 1,
  },
  {
    id: 'local',
    name: 'Local comercial',
    description: 'Reforma.',
    imageUrl: 'https://example.com/l.jpg',
    category: 'Reformas',
    displayOrder: 2,
  },
]

const hoursData = {
  weekly: [
    {
      dayOfWeek: 'MONDAY',
      closed: false,
      morningOpen: '08:00',
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: '18:00',
    },
    {
      dayOfWeek: 'SUNDAY',
      closed: true,
      morningOpen: null,
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: null,
    },
  ],
  upcomingExceptions: [],
}

vi.mock('../../../core/tenant/useServices', () => ({
  useServices: () => ({ status: 'success', data: servicesData }),
}))
vi.mock('../../../core/tenant/useProjects', () => ({
  useProjects: () => ({ status: 'success', data: projectsData }),
}))
vi.mock('../../../core/tenant/useBusinessHours', () => ({
  useBusinessHours: () => ({ status: 'success', data: hoursData }),
}))
// Showroom shop products: avoid network; hasShop is false so it isn't rendered.
vi.mock('../../../core/tenant/useTenantResource', () => ({
  useTenantResource: () => ({ status: 'success', data: [] }),
}))

function renderAt(path: string) {
  const i18n = createI18nInstance('es')
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/construccion-multi" element={<ConstruccionLayout />}>
              <Route index element={<ConstruccionHomePage />} />
              <Route path="servicios" element={<ConstruccionServiciosPage />} />
              <Route path="proyectos" element={<ConstruccionProyectosPage />} />
              <Route path="showroom" element={<ConstruccionShowroomPage />} />
              <Route path="contacto" element={<ConstruccionContactoPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('Construccion multi-page', () => {
  it('renders the primary nav with the five sections', () => {
    renderAt('/construccion-multi')

    const nav = screen.getByRole('navigation')
    for (const label of ['Inicio', 'Servicios', 'Proyectos', 'Showroom', 'Contacto']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('marks the active route with aria-current="page"', () => {
    renderAt('/construccion-multi/servicios')

    const nav = screen.getByRole('navigation')
    expect(within(nav).getByRole('link', { name: 'Servicios' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('builds absolute nav targets from the layout base (no segment accumulation)', () => {
    // Regression: from a nested route, relative links used to accumulate
    // (/proyectos/servicios). Targets must be absolute against the layout base.
    renderAt('/construccion-multi/proyectos')

    const nav = screen.getByRole('navigation')
    expect(within(nav).getByRole('link', { name: 'Servicios' })).toHaveAttribute(
      'href',
      '/construccion-multi/servicios',
    )
    expect(within(nav).getByRole('link', { name: 'Inicio' })).toHaveAttribute(
      'href',
      '/construccion-multi',
    )
    // Active state tracks the current route.
    expect(within(nav).getByRole('link', { name: 'Proyectos' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Servicios' })).not.toHaveAttribute('aria-current')
  })

  it('renders the home page with hero, services and projects', () => {
    renderAt('/construccion-multi')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Construimos tu sueño' }),
    ).toBeInTheDocument()
    // "Obra nueva" is both a service name and a project category, so assert on
    // unambiguous text: the second service and a project title.
    expect(screen.getByText('Reformas integrales')).toBeInTheDocument()
    expect(screen.getByText('Villa Puerto de Santiago')).toBeInTheDocument()
  })

  it('renders the servicios page with all services and testimonials', () => {
    renderAt('/construccion-multi/servicios')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Nuestros servicios' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Obra nueva')).toBeInTheDocument()
    expect(screen.getByText('Reformas integrales')).toBeInTheDocument()
    // Sample testimonial.
    expect(screen.getByText('Carlos Díaz')).toBeInTheDocument()
  })

  it('renders the proyectos page with the mosaic', () => {
    renderAt('/construccion-multi/proyectos')

    expect(screen.getByRole('heading', { level: 1, name: 'Nuestros proyectos' })).toBeInTheDocument()
    expect(screen.getByText('Villa Puerto de Santiago')).toBeInTheDocument()
    expect(screen.getByText('Local comercial')).toBeInTheDocument()
  })

  it('renders the showroom page with sample materials when there is no shop', () => {
    renderAt('/construccion-multi/showroom')

    expect(screen.getByRole('heading', { level: 1, name: 'Showroom' })).toBeInTheDocument()
    expect(screen.getByText('VERSACE')).toBeInTheDocument()
  })

  it('renders the contacto page with hours and the budget form', () => {
    renderAt('/construccion-multi/contacto')

    expect(screen.getByRole('heading', { level: 1, name: 'Contacto' })).toBeInTheDocument()
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
    expect(screen.getByRole('form', { name: /presupuesto/i })).toBeInTheDocument()
  })
})

/**
 * Production mount: TenantRouter renders a nested descendant `<Routes>` (under a
 * `path="*"` parent) with a PATHLESS layout route, and the tenant is served at
 * root (`/`, `/servicios`…). This is the mount where `useResolvedPath('.')`
 * returned the leaf and links accumulated — `computeBase` must fix it.
 */
function renderViaTenantRouter(path: string) {
  const i18n = createI18nInstance('es')
  function ConstruccionMultiLike() {
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
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="*" element={<ConstruccionMultiLike />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('Construccion multi-page (production TenantRouter mount, tenant at root)', () => {
  it('builds root-absolute nav targets from a nested route (no accumulation)', () => {
    renderViaTenantRouter('/servicios')

    const nav = screen.getByRole('navigation')
    // The bug: from /servicios, "Proyectos" used to resolve to /servicios/proyectos.
    expect(within(nav).getByRole('link', { name: 'Proyectos' })).toHaveAttribute(
      'href',
      '/proyectos',
    )
    expect(within(nav).getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/')
  })

  it('marks the active route with aria-current="page" at root', () => {
    renderViaTenantRouter('/servicios')

    const nav = screen.getByRole('navigation')
    expect(within(nav).getByRole('link', { name: 'Servicios' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('renders the routed leaf content (servicios) under the pathless layout', () => {
    renderViaTenantRouter('/servicios')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Nuestros servicios' }),
    ).toBeInTheDocument()
  })
})
