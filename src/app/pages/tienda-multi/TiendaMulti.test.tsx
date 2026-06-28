import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { testI18n } from '../../../test-utils'
import TiendaLayout from './TiendaLayout'
import TiendaHomePage from './TiendaHomePage'
import TiendaProductosPage from './TiendaProductosPage'
import TiendaCarritoPage from './TiendaCarritoPage'
import TiendaContactoPage from './TiendaContactoPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={testI18n}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/tienda-multi" element={<TiendaLayout />}>
              <Route index element={<TiendaHomePage />} />
              <Route path="productos" element={<TiendaProductosPage />} />
              <Route path="carrito" element={<TiendaCarritoPage />} />
              <Route path="contacto" element={<TiendaContactoPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('Tienda multi-page', () => {
  it('renders the primary nav with 4 links', () => {
    renderAt('/tienda-multi')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent)

    expect(labels).toEqual(['Inicio', 'Tienda', 'Carrito', 'Contacto'])
  })

  it('marks the active route with aria-current="page"', () => {
    renderAt('/tienda-multi/productos')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Tienda' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('renders the home page with the hero and a CTA', () => {
    renderAt('/tienda-multi')

    expect(
      screen.getByRole('heading', { level: 1, name: /el rincón canario/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver todo el catálogo' })).toHaveAttribute(
      'href',
      '/tienda-multi/productos',
    )
  })

  it('renders the productos page with product categories', () => {
    renderAt('/tienda-multi/productos')

    expect(screen.getByRole('heading', { level: 1, name: 'Nuestra tienda' })).toBeInTheDocument()
    expect(screen.getByText('Salsas y mojos')).toBeInTheDocument()
    expect(screen.getByText('Quesos')).toBeInTheDocument()
  })

  it('renders the carrito page with the empty cart message', () => {
    renderAt('/tienda-multi/carrito')

    expect(screen.getAllByRole('heading', { name: 'Tu carrito' }).length).toBeGreaterThan(0)
    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
  })

  it('renders the contacto page with the opening hours', () => {
    renderAt('/tienda-multi/contacto')

    expect(screen.getByRole('heading', { level: 1, name: 'Dónde estamos' })).toBeInTheDocument()
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })
})
