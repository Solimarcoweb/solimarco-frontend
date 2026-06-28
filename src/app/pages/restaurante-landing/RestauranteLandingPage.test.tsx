import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import RestauranteLandingPage from './RestauranteLandingPage'

const config: TenantConfig = {
  tenantId: 'demo-el-drago',
  businessName: 'Restaurante El Drago',
  themeName: 'calido',
  siteType: 'LANDING',
  sector: 'restaurante',
  locale: 'es',
  businessDescription: 'Cocina canaria de mercado en el Puerto de la Cruz.',
  phone: '+34 922 38 25 40',
  email: 'reservas@restauranteeldrago.es',
  address: 'Calle Quintana 14, Puerto de la Cruz',
  modules: { hasShop: false, hasReservations: true, hasCitas: false, hasBudgetForm: false },
}

vi.mock('../../../core/tenant/TenantContext', () => ({
  useTenantConfig: () => config,
  useOptionalTenantConfig: () => config,
}))
vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({ usePageTracking: () => {} }))

const menu = vi.fn()
const hours = vi.fn()
vi.mock('../../../core/tenant/useMenu', () => ({ useMenu: () => menu() }))
vi.mock('../../../core/tenant/useBusinessHours', () => ({ useBusinessHours: () => hours() }))

function renderPage() {
  const i18n = createI18nInstance('es')
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <RestauranteLandingPage />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

const menuData = [
  {
    id: 'entrantes',
    name: 'Entrantes',
    displayOrder: 1,
    items: [
      {
        id: 'croquetas',
        name: 'Croquetas de pescado',
        description: 'Cremosas.',
        price: 9.5,
        imageUrl: 'https://example.com/c.jpg',
        allergens: ['gluten'],
        available: true,
        displayOrder: 1,
      },
    ],
  },
  {
    id: 'postres',
    name: 'Postres',
    displayOrder: 2,
    items: [
      {
        id: 'quesillo',
        name: 'Quesillo',
        description: 'Flan isleño.',
        price: 5.5,
        imageUrl: 'https://example.com/q.jpg',
        allergens: ['lactosa'],
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
      morningOpen: '13:00',
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: '23:00',
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

describe('RestauranteLandingPage', () => {
  it('shows a loading state while resources load', () => {
    menu.mockReturnValue({ status: 'loading' })
    hours.mockReturnValue({ status: 'loading' })

    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)
  })

  it('shows an error state when a resource fails', () => {
    menu.mockReturnValue({ status: 'error', message: 'boom' })
    hours.mockReturnValue({ status: 'success', data: hoursData })

    renderPage()

    expect(screen.getByRole('alert')).toHaveTextContent(/no se ha podido cargar/i)
  })

  it('renders the tenant-driven hero, menu and hours on success', () => {
    menu.mockReturnValue({ status: 'success', data: menuData })
    hours.mockReturnValue({ status: 'success', data: hoursData })

    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Restaurante El Drago' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Entrantes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Postres' })).toBeInTheDocument()
    // Weekday enum localized + closed day.
    expect(screen.getByText('Martes')).toBeInTheDocument()
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Restaurante El Drago')
  })
})
