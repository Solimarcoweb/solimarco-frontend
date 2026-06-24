import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import RestauranteLandingPage from './RestauranteLandingPage'

// Page-view tracking is exercised in its own module; stub it here so the page
// test never touches the network.
vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

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

describe('RestauranteLandingPage', () => {
  it('renders the hero heading', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: /pastelería la isla/i }),
    ).toBeInTheDocument()
  })

  it('renders the menu categories', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Tartas' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bollería' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cafés e infusiones' })).toBeInTheDocument()
  })

  it('renders the business hours', () => {
    renderPage()

    expect(screen.getByText('Martes')).toBeInTheDocument()
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })

  it('renders the footer with the business name', () => {
    renderPage()

    expect(screen.getByRole('contentinfo')).toHaveTextContent('Pastelería La Isla')
  })
})
