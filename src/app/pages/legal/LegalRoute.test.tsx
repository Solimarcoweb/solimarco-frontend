import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import LegalRoute, { LegalFallback } from './LegalRoute'

// Replace the lazy chrome with a trivial component so the route test exercises
// the wiring without the heavy sector chrome.
vi.mock('./LegalChrome', () => ({ default: () => <div>CHROME</div> }))

function withProviders(node: React.ReactNode) {
  const i18n = createI18nInstance('es')
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{node}</MemoryRouter>
    </I18nextProvider>
  )
}

describe('LegalFallback', () => {
  it('renders a full-viewport, theme-driven skeleton surface', () => {
    render(withProviders(<LegalFallback />))

    const status = screen.getByRole('status', { name: /cargando/i })
    expect(status.parentElement?.className).toMatch(/fallback/)
  })
})

describe('LegalRoute', () => {
  it('renders the (lazy) sector chrome', async () => {
    render(withProviders(<LegalRoute />))
    expect(await screen.findByText('CHROME')).toBeInTheDocument()
  })
})
