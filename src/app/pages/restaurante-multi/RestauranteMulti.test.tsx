import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import RestauranteLayout from './RestauranteLayout'
import RestauranteHomePage from './RestauranteHomePage'
import RestauranteCartaPage from './RestauranteCartaPage'
import RestauranteReservasPage from './RestauranteReservasPage'
import RestauranteContactoPage from './RestauranteContactoPage'

const config: TenantConfig = {
  tenantId: 'demo-el-drago',
  businessName: 'Restaurante El Drago',
  themeName: 'calido',
  siteType: 'FULL',
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
    id: 'principales',
    name: 'Principales',
    displayOrder: 2,
    items: [
      {
        id: 'cherne',
        name: 'Lomo de cherne',
        description: 'A la plancha.',
        price: 18,
        imageUrl: 'https://example.com/ch.jpg',
        allergens: ['pescado'],
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

vi.mock('../../../core/tenant/useMenu', () => ({
  useMenu: () => ({ status: 'success', data: menuData }),
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
            <Route path="/restaurante-multi" element={<RestauranteLayout />}>
              <Route index element={<RestauranteHomePage />} />
              <Route path="carta" element={<RestauranteCartaPage />} />
              <Route path="reservas" element={<RestauranteReservasPage />} />
              <Route path="contacto" element={<RestauranteContactoPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('Restaurante multi-page', () => {
  it('renders the primary nav with the four links', () => {
    renderAt('/restaurante-multi')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent)

    expect(labels).toEqual(['Inicio', 'Carta', 'Reservas', 'Contacto'])
  })

  it('marks the active route with aria-current="page"', () => {
    renderAt('/restaurante-multi/carta')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Carta' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('renders the home page with the hero and a reservation CTA', () => {
    renderAt('/restaurante-multi')

    expect(
      screen.getByRole('heading', { level: 1, name: /restaurante el drago/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reservar mesa' })).toHaveAttribute(
      'href',
      '/restaurante-multi/reservas',
    )
  })

  it('renders the carta page with the menu categories', () => {
    renderAt('/restaurante-multi/carta')

    expect(screen.getByRole('heading', { level: 1, name: 'Nuestra carta' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Entrantes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Principales' })).toBeInTheDocument()
  })

  it('renders the reservas page with the reservation form', () => {
    renderAt('/restaurante-multi/reservas')

    expect(screen.getByRole('heading', { level: 1, name: 'Reserva tu mesa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reservar mesa' })).toBeInTheDocument()
  })

  it('renders the contacto page with the opening hours', () => {
    renderAt('/restaurante-multi/contacto')

    expect(screen.getByRole('heading', { level: 1, name: 'Dónde estamos' })).toBeInTheDocument()
    expect(screen.getByText('Martes')).toBeInTheDocument()
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })
})
