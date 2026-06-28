import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import MecanicoLandingPage from './MecanicoLandingPage'

const config: TenantConfig = {
  tenantId: 'demo-el-teide',
  businessName: 'Taller Mecánico El Teide',
  themeName: 'urbano',
  siteType: 'LANDING',
  sector: 'mecanico',
  locale: 'es',
  businessDescription: 'Mecánica, frenos, ITV y electricidad.',
  phone: '+34 922 25 41 60',
  email: 'taller@mecanicoelteide.es',
  address: 'Calle Heliodoro Rodríguez López 8, La Laguna',
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
          <MecanicoLandingPage />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

const servicesData = [
  {
    id: 'mantenimiento',
    name: 'Mantenimiento y revisión',
    description: 'Revisión completa.',
    imageUrl: 'https://example.com/m.jpg',
    displayOrder: 1,
  },
  {
    id: 'frenos',
    name: 'Frenos y suspensión',
    description: 'Pastillas y discos.',
    imageUrl: 'https://example.com/f.jpg',
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

describe('MecanicoLandingPage', () => {
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
      screen.getByRole('heading', { level: 1, name: 'Taller Mecánico El Teide' }),
    ).toBeInTheDocument()
    // Each service name appears twice: in the catalog and in the appointment select.
    expect(screen.getAllByText('Mantenimiento y revisión').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Frenos y suspensión').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Taller Mecánico El Teide')
  })
})
