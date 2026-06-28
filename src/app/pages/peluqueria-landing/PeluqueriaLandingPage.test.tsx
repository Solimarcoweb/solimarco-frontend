import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import PeluqueriaLandingPage from './PeluqueriaLandingPage'

const config: TenantConfig = {
  tenantId: 'demo-brisa-atlantica',
  businessName: 'Peluquería Brisa Atlántica',
  themeName: 'mediterraneo',
  siteType: 'LANDING',
  sector: 'peluqueria',
  locale: 'es',
  businessDescription: 'Corte, color, mechas y tratamientos capilares.',
  phone: '+34 922 79 05 44',
  email: 'hola@brisaatlantica.es',
  address: 'Avenida Juan Carlos I 23, Los Cristianos',
  modules: { hasShop: false, hasReservations: false, hasCitas: true, hasBudgetForm: false },
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
          <PeluqueriaLandingPage />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

const servicesData = [
  {
    id: 'corte-mujer',
    name: 'Corte y peinado mujer',
    description: 'Consulta de imagen.',
    imageUrl: 'https://example.com/c.jpg',
    displayOrder: 1,
  },
  {
    id: 'coloracion',
    name: 'Coloración completa',
    description: 'Sin amoníaco disponible.',
    imageUrl: 'https://example.com/col.jpg',
    displayOrder: 2,
  },
]

const hoursData = {
  weekly: [
    {
      dayOfWeek: 'TUESDAY',
      closed: false,
      morningOpen: '09:30',
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: '19:30',
    },
    {
      dayOfWeek: 'MONDAY',
      closed: true,
      morningOpen: null,
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: null,
    },
  ],
  upcomingExceptions: [],
}

describe('PeluqueriaLandingPage', () => {
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

  it('renders the tenant-driven hero, services and appointment form', () => {
    services.mockReturnValue({ status: 'success', data: servicesData })
    hours.mockReturnValue({ status: 'success', data: hoursData })

    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Peluquería Brisa Atlántica' }),
    ).toBeInTheDocument()
    // Each service name appears twice: in the catalog and in the appointment select.
    expect(screen.getAllByText('Corte y peinado mujer').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Coloración completa').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Peluquería Brisa Atlántica')
  })
})
