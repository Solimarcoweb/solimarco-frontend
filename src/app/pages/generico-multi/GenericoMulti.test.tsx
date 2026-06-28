import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import GenericoLayout from './GenericoLayout'
import GenericoHomePage from './GenericoHomePage'
import GenericoServiciosPage from './GenericoServiciosPage'
import GenericoPresupuestoPage from './GenericoPresupuestoPage'
import GenericoContactoPage from './GenericoContactoPage'

const config: TenantConfig = {
  tenantId: 'demo-generico',
  businessName: 'Servicios Profesionales Tenerife',
  themeName: 'clasico',
  siteType: 'FULL',
  sector: 'generico',
  locale: 'es',
  businessDescription: 'Consultoría, gestión y tramitaciones.',
  phone: '+34 922 28 61 40',
  email: 'info@serviciostenerife.es',
  address: 'Calle Méndez Núñez 38, Santa Cruz de Tenerife',
  modules: { hasShop: false, hasReservations: false, hasCitas: false, hasBudgetForm: true },
}

vi.mock('../../../core/tenant/TenantContext', () => ({
  useTenantConfig: () => config,
  useOptionalTenantConfig: () => config,
}))
vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({ usePageTracking: () => {} }))

const servicesData = [
  {
    id: 'consultoria',
    name: 'Consultoría y asesoramiento',
    description: 'Primera consulta gratuita.',
    imageUrl: 'https://example.com/c.jpg',
    displayOrder: 1,
  },
  {
    id: 'soporte',
    name: 'Soporte y mantenimiento',
    description: 'Respuesta garantizada.',
    imageUrl: 'https://example.com/s.jpg',
    displayOrder: 2,
  },
]

const hoursData = {
  weekly: [
    {
      dayOfWeek: 'MONDAY',
      closed: false,
      morningOpen: '08:30',
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: '18:00',
    },
    {
      dayOfWeek: 'SATURDAY',
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
vi.mock('../../../core/tenant/useBusinessHours', () => ({
  useBusinessHours: () => ({ status: 'success', data: hoursData }),
}))

function renderAt(path: string) {
  const i18n = createI18nInstance('es')
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/generico-multi" element={<GenericoLayout />}>
              <Route index element={<GenericoHomePage />} />
              <Route path="servicios" element={<GenericoServiciosPage />} />
              <Route path="presupuesto" element={<GenericoPresupuestoPage />} />
              <Route path="contacto" element={<GenericoContactoPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('Generico multi-page', () => {
  it('renders the primary nav with 4 links', () => {
    renderAt('/generico-multi')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent)

    expect(labels).toEqual(['Inicio', 'Servicios', 'Presupuesto', 'Contacto'])
  })

  it('marks the active route with aria-current="page"', () => {
    renderAt('/generico-multi/servicios')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Servicios' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('renders the home page with the hero and a CTA', () => {
    renderAt('/generico-multi')

    expect(
      screen.getByRole('heading', { level: 1, name: /servicios profesionales tenerife/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Solicitar presupuesto' })).toHaveAttribute(
      'href',
      '/generico-multi/presupuesto',
    )
  })

  it('renders the servicios page with the full services list', () => {
    renderAt('/generico-multi/servicios')

    expect(screen.getByRole('heading', { level: 1, name: 'Nuestros servicios' })).toBeInTheDocument()
    expect(screen.getByText('Consultoría y asesoramiento')).toBeInTheDocument()
    expect(screen.getByText('Soporte y mantenimiento')).toBeInTheDocument()
  })

  it('renders the presupuesto page with the budget form', () => {
    renderAt('/generico-multi/presupuesto')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Solicitar presupuesto' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /solicitar presupuesto/i })).toBeInTheDocument()
  })

  it('renders the contacto page with the opening hours', () => {
    renderAt('/generico-multi/contacto')

    expect(screen.getByRole('heading', { level: 1, name: 'Dónde estamos' })).toBeInTheDocument()
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })
})
