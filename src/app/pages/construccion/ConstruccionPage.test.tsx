import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import ConstruccionPage from './ConstruccionPage'

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
          <ConstruccionPage />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('ConstruccionPage', () => {
  it('renders the hero heading', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: /construcción y reformas en tenerife/i }),
    ).toBeInTheDocument()
  })

  it('renders the budget request form', () => {
    renderPage()

    expect(screen.getByRole('form', { name: /presupuesto/i })).toBeInTheDocument()
  })

  it('renders the footer with the business contact details', () => {
    renderPage()

    expect(screen.getByRole('contentinfo')).toHaveTextContent('BM Construcción S.L.')
  })
})
