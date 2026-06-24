import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it, vi } from 'vitest'
import EsteticaLandingPage from './EsteticaLandingPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderPage() {
  return render(
    <HelmetProvider>
      <EsteticaLandingPage />
    </HelmetProvider>,
  )
}

describe('EsteticaLandingPage', () => {
  it('renders the hero heading', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: /centro estético magnolia/i }),
    ).toBeInTheDocument()
  })

  it('renders the treatments list with categories', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Nuestros tratamientos' })).toBeInTheDocument()
    expect(screen.getByText('Tratamientos faciales')).toBeInTheDocument()
    expect(screen.getByText('Depilación')).toBeInTheDocument()
  })

  it('renders the appointment form', () => {
    renderPage()

    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
  })

  it('renders the business info section', () => {
    renderPage()

    expect(screen.getAllByText(/Calle Blanco/i).length).toBeGreaterThan(0)
  })
})
