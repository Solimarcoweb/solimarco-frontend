import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it, vi } from 'vitest'
import TiendaLandingPage from './TiendaLandingPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderPage() {
  return render(
    <HelmetProvider>
      <TiendaLandingPage />
    </HelmetProvider>,
  )
}

describe('TiendaLandingPage', () => {
  it('renders the hero heading', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: /el rincón canario/i }),
    ).toBeInTheDocument()
  })

  it('renders product catalog with categories', () => {
    renderPage()

    expect(screen.getByText('Salsas y mojos')).toBeInTheDocument()
    expect(screen.getByText('Gofio y cereales')).toBeInTheDocument()
    expect(screen.getByText('Quesos')).toBeInTheDocument()
  })

  it('renders the cart section (initially empty)', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Tu carrito' })).toBeInTheDocument()
    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
  })

  it('renders the business info section', () => {
    renderPage()

    expect(screen.getAllByText(/Calle del Castillo/i).length).toBeGreaterThan(0)
  })
})
