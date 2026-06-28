import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import EsteticaLandingPage from './EsteticaLandingPage'

const config: TenantConfig = {
  tenantId: 'demo-magnolia',
  businessName: 'Centro Estético Magnolia',
  themeName: 'editorial',
  siteType: 'LANDING',
  sector: 'estetica',
  locale: 'es',
  businessDescription: 'Tratamientos faciales, corporales y depilación.',
  phone: '+34 922 37 14 88',
  email: 'hola@centromagnolia.es',
  address: 'Calle Blanco 12, Puerto de la Cruz',
  modules: { hasShop: false, hasReservations: false, hasCitas: true, hasBudgetForm: false },
}

vi.mock('../../../core/tenant/TenantContext', () => ({
  useTenantConfig: () => config,
  useOptionalTenantConfig: () => config,
}))
vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({ usePageTracking: () => {} }))

const treatments = vi.fn()
const hours = vi.fn()
vi.mock('../../../core/tenant/useTreatments', () => ({ useTreatments: () => treatments() }))
vi.mock('../../../core/tenant/useBusinessHours', () => ({ useBusinessHours: () => hours() }))

function renderPage() {
  const i18n = createI18nInstance('es')
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <EsteticaLandingPage />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

const treatmentsData = [
  {
    id: 'faciales',
    name: 'Tratamientos faciales',
    displayOrder: 1,
    items: [
      {
        id: 'hidratacion',
        name: 'Hidratación facial',
        description: 'Intensiva.',
        price: 55,
        durationMinutes: 60,
        imageUrl: 'https://example.com/f.jpg',
        available: true,
        displayOrder: 1,
      },
    ],
  },
  {
    id: 'depilacion',
    name: 'Depilación',
    displayOrder: 2,
    items: [
      {
        id: 'laser',
        name: 'Depilación láser',
        description: 'Diodo.',
        price: 30,
        durationMinutes: 30,
        imageUrl: 'https://example.com/l.jpg',
        available: true,
        displayOrder: 1,
      },
    ],
  },
]

const hoursData = {
  weekly: [
    {
      dayOfWeek: 'TUESDAY',
      closed: false,
      morningOpen: '10:00',
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: '20:00',
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

describe('EsteticaLandingPage', () => {
  it('shows a loading state while resources load', () => {
    treatments.mockReturnValue({ status: 'loading' })
    hours.mockReturnValue({ status: 'loading' })

    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)
  })

  it('shows an error state when a resource fails', () => {
    treatments.mockReturnValue({ status: 'error', message: 'boom' })
    hours.mockReturnValue({ status: 'success', data: hoursData })

    renderPage()

    expect(screen.getByRole('alert')).toHaveTextContent(/no se ha podido cargar/i)
  })

  it('renders the tenant-driven hero, treatments and appointment form', () => {
    treatments.mockReturnValue({ status: 'success', data: treatmentsData })
    hours.mockReturnValue({ status: 'success', data: hoursData })

    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Centro Estético Magnolia' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Tratamientos faciales')).toBeInTheDocument()
    expect(screen.getByText('Depilación')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Centro Estético Magnolia')
  })
})
