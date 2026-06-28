import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import ConstruccionLandingPage from './ConstruccionLandingPage'

const config: TenantConfig = {
  tenantId: 'bm-construccion',
  businessName: 'BM Construcción S.L.',
  themeName: 'clasico',
  pageType: 'landing',
  sector: 'construccion',
  locale: 'es',
  businessDescription: 'Reformas y obra nueva en Tenerife.',
  phone: '+34 922 65 41 30',
  email: 'info@bmconstruccionsl.com',
  address: 'Calle La Hornera 48, La Laguna',
  modules: { hasShop: false, hasReservations: false, hasCitas: false, hasBudgetForm: true },
}

vi.mock('../../../core/tenant/TenantContext', () => ({
  useTenantConfig: () => config,
  useOptionalTenantConfig: () => config,
}))
vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({ usePageTracking: () => {} }))

// Resource hooks are stubbed per-test via these mutable holders.
const services = vi.fn()
const projects = vi.fn()
const hours = vi.fn()
vi.mock('../../../core/tenant/useServices', () => ({ useServices: () => services() }))
vi.mock('../../../core/tenant/useProjects', () => ({ useProjects: () => projects() }))
vi.mock('../../../core/tenant/useBusinessHours', () => ({ useBusinessHours: () => hours() }))

function renderPage() {
  const i18n = createI18nInstance('es')
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <ConstruccionLandingPage />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('ConstruccionLandingPage', () => {
  it('shows a loading state while resources load', () => {
    services.mockReturnValue({ status: 'loading' })
    projects.mockReturnValue({ status: 'loading' })
    hours.mockReturnValue({ status: 'loading' })

    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)
  })

  it('shows an error state when a resource fails', () => {
    services.mockReturnValue({ status: 'error', message: 'boom' })
    projects.mockReturnValue({ status: 'success', data: [] })
    hours.mockReturnValue({ status: 'success', data: [] })

    renderPage()

    expect(screen.getByRole('alert')).toHaveTextContent(/no se ha podido cargar/i)
  })

  it('renders the tenant-driven content on success', () => {
    services.mockReturnValue({
      status: 'success',
      data: [
        {
          id: 'reforma',
          name: 'Reformas integrales',
          description: 'Llave en mano.',
          imageUrl: 'https://example.com/s.jpg',
          displayOrder: 1,
        },
      ],
    })
    projects.mockReturnValue({
      status: 'success',
      data: [
        {
          id: 'p1',
          name: 'Baño en La Laguna',
          description: 'Reforma completa.',
          imageUrl: 'https://example.com/b.jpg',
          category: 'Baño',
          displayOrder: 1,
        },
      ],
    })
    hours.mockReturnValue({
      status: 'success',
      data: {
        weekly: [
          {
            dayOfWeek: 'MONDAY',
            closed: false,
            morningOpen: '08:00',
            morningClose: '13:00',
            afternoonOpen: '16:00',
            afternoonClose: '18:00',
          },
        ],
        upcomingExceptions: [],
      },
    })

    renderPage()

    expect(screen.getByRole('heading', { level: 1, name: 'BM Construcción S.L.' })).toBeInTheDocument()
    expect(screen.getByText('Reformas integrales')).toBeInTheDocument()
    expect(screen.getByText('Baño en La Laguna')).toBeInTheDocument()
    expect(screen.getByRole('form', { name: /presupuesto/i })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('BM Construcción S.L.')
  })
})
