import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it, vi } from 'vitest'
import MecanicoLandingPage from './MecanicoLandingPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderPage() {
  return render(
    <HelmetProvider>
      <MecanicoLandingPage />
    </HelmetProvider>,
  )
}

describe('MecanicoLandingPage', () => {
  it('renders the hero heading', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: /taller mecánico el teide/i }),
    ).toBeInTheDocument()
  })

  it('renders the services list section', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Nuestros servicios' })).toBeInTheDocument()
    expect(screen.getAllByText('Mantenimiento y revisión').length).toBeGreaterThan(0)
  })

  it('renders the appointment form', () => {
    renderPage()

    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
  })

  it('renders the business info section', () => {
    renderPage()

    expect(screen.getAllByText(/Heliodoro Rodríguez/i).length).toBeGreaterThan(0)
  })
})
