import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import GenericoLandingPage from './GenericoLandingPage'

const config: TenantConfig = {
  tenantId: 'demo-generico',
  businessName: 'Servicios Profesionales Tenerife',
  themeName: 'clasico',
  siteType: 'LANDING',
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

const services = vi.fn()
const hours = vi.fn()
vi.mock('../../../core/tenant/useServices', () => ({ useServices: () => services() }))
vi.mock('../../../core/tenant/useBusinessHours', () => ({ useBusinessHours: () => hours() }))

function renderPage() {
  const i18n = createI18nInstance('es')
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <GenericoLandingPage />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

const servicesData = [
  {
    id: 'consultoria',
    name: 'Consultoría y asesoramiento',
    description: 'Primera consulta gratuita.',
    imageUrl: 'https://example.com/c.jpg',
    displayOrder: 1,
  },
  {
    id: 'gestion',
    name: 'Gestión de proyectos',
    description: 'Metodología ágil.',
    imageUrl: 'https://example.com/g.jpg',
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

describe('GenericoLandingPage', () => {
  it('shows a loading state while resources load', () => {
    services.mockReturnValue({ status: 'loading' })
    hours.mockReturnValue({ status: 'loading' })

    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)
  })

  it('shows an error state when a resource fails', () => {
    services.mockReturnValue({ status: 'error', message: 'boom' })
    hours.mockReturnValue({ status: 'success', data: hoursData })

    renderPage()

    expect(screen.getByRole('alert')).toHaveTextContent(/no se ha podido cargar/i)
  })

  it('renders the tenant-driven hero, services and budget form', () => {
    services.mockReturnValue({ status: 'success', data: servicesData })
    hours.mockReturnValue({ status: 'success', data: hoursData })

    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Servicios Profesionales Tenerife' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Consultoría y asesoramiento')).toBeInTheDocument()
    expect(screen.getByText('Gestión de proyectos')).toBeInTheDocument()
    expect(screen.getByRole('form', { name: /presupuesto/i })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Servicios Profesionales Tenerife')
  })
})
