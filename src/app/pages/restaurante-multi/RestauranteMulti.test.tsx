import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import RestauranteLayout from './RestauranteLayout'
import RestauranteHomePage from './RestauranteHomePage'
import RestauranteCartaPage from './RestauranteCartaPage'
import RestauranteReservasPage from './RestauranteReservasPage'
import RestauranteContactoPage from './RestauranteContactoPage'

// Tracking is exercised in its own module; stub it so the page tests never
// touch the network.
vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
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
