import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import { testI18n } from '../../../test-utils'
import PeluqueriaLandingPage from './PeluqueriaLandingPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderPage() {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={testI18n}>
        <PeluqueriaLandingPage />
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('PeluqueriaLandingPage', () => {
  it('renders the hero heading', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: /peluquería brisa atlántica/i }),
    ).toBeInTheDocument()
  })

  it('renders the services list', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Nuestros servicios' })).toBeInTheDocument()
    expect(screen.getAllByText('Corte y peinado mujer').length).toBeGreaterThan(0)
  })

  it('renders the appointment form', () => {
    renderPage()

    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
  })

  it('renders the business info section', () => {
    renderPage()

    expect(screen.getAllByText(/Juan Carlos I/i).length).toBeGreaterThan(0)
  })
})
