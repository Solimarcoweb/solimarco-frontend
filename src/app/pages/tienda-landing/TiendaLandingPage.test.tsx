import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import TiendaLandingPage from './TiendaLandingPage'

const config: TenantConfig = {
  tenantId: 'demo-rincon-canario',
  businessName: 'El Rincón Canario',
  themeName: 'fresco',
  siteType: 'LANDING',
  sector: 'tienda',
  locale: 'es',
  businessDescription: 'Productos típicos canarios.',
  phone: '+34 922 24 07 13',
  email: 'hola@elrinconcanario.es',
  address: 'Calle del Castillo 58, Santa Cruz de Tenerife',
  modules: { hasShop: true, hasReservations: false, hasCitas: false, hasBudgetForm: false },
}

vi.mock('../../../core/tenant/TenantContext', () => ({
  useTenantConfig: () => config,
  useOptionalTenantConfig: () => config,
}))
vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({ usePageTracking: () => {} }))

const products = vi.fn()
const hours = vi.fn()
vi.mock('../../../core/tenant/useProducts', () => ({ useProducts: () => products() }))
vi.mock('../../../core/tenant/useBusinessHours', () => ({ useBusinessHours: () => hours() }))

function renderPage() {
  const i18n = createI18nInstance('es')
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <TiendaLandingPage />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

const productsData = [
  {
    id: 'mojo-rojo',
    name: 'Mojo rojo',
    description: 'Picón.',
    price: 4.5,
    unit: 'tarro 200 g',
    category: 'Salsas y mojos',
    imageUrl: 'https://example.com/m.jpg',
    stock: 10,
  },
  {
    id: 'queso-majorero',
    name: 'Queso majorero',
    description: 'DOP.',
    price: 9.8,
    unit: 'pieza',
    category: 'Quesos',
    imageUrl: 'https://example.com/q.jpg',
    stock: 5,
  },
]

const hoursData = {
  weekly: [
    {
      dayOfWeek: 'MONDAY',
      closed: false,
      morningOpen: '09:30',
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: '20:00',
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

describe('TiendaLandingPage', () => {
  it('shows a loading state while resources load', () => {
    products.mockReturnValue({ status: 'loading' })
    hours.mockReturnValue({ status: 'loading' })

    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)
  })

  it('shows an error state when a resource fails', () => {
    products.mockReturnValue({ status: 'error', message: 'boom' })
    hours.mockReturnValue({ status: 'success', data: hoursData })

    renderPage()

    expect(screen.getByRole('alert')).toHaveTextContent(/no se ha podido cargar/i)
  })

  it('renders the tenant-driven catalog, cart and business info', () => {
    products.mockReturnValue({ status: 'success', data: productsData })
    hours.mockReturnValue({ status: 'success', data: hoursData })

    renderPage()

    expect(screen.getByRole('heading', { level: 1, name: 'El Rincón Canario' })).toBeInTheDocument()
    expect(screen.getByText('Salsas y mojos')).toBeInTheDocument()
    expect(screen.getByText('Quesos')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tu carrito' })).toBeInTheDocument()
    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('El Rincón Canario')
  })
})
