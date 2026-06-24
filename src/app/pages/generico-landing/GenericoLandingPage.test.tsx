import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import { testI18n } from '../../../test-utils'
import GenericoLandingPage from './GenericoLandingPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderPage() {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={testI18n}>
        <GenericoLandingPage />
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('GenericoLandingPage', () => {
  it('renders the hero heading', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: /servicios profesionales tenerife/i }),
    ).toBeInTheDocument()
  })

  it('renders the services list', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Nuestros servicios' })).toBeInTheDocument()
    expect(screen.getAllByText('Consultoría y asesoramiento').length).toBeGreaterThan(0)
  })

  it('renders the budget form', () => {
    renderPage()

    expect(screen.getByRole('button', { name: /solicitar presupuesto/i })).toBeInTheDocument()
  })

  it('renders the business info section', () => {
    renderPage()

    expect(screen.getAllByText(/Méndez Núñez/i).length).toBeGreaterThan(0)
  })
})
