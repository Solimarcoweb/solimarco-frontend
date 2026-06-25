import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import LegalPageRoute from './LegalPageRoute'

// Stub the heavy view: capture the props the route resolves and passes down.
vi.mock('../LegalPageView', () => ({
  LegalPageView: ({ tenantSlug, type }: { tenantSlug: string; type: string }) => (
    <div data-testid="legal-view" data-tenant={tenantSlug} data-type={type} />
  ),
}))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/legal/:slug" element={<LegalPageRoute />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LegalPageRoute', () => {
  it.each([
    ['privacidad', 'POLITICA_PRIVACIDAD'],
    ['aviso-legal', 'AVISO_LEGAL'],
    ['cookies', 'COOKIES'],
    ['terminos-venta', 'TERMINOS_VENTA'],
  ])('renders LegalPageView for /legal/%s with type %s', (slug, type) => {
    renderAt(`/legal/${slug}`)

    expect(screen.getByTestId('legal-view')).toHaveAttribute('data-type', type)
  })

  it('resolves the tenant slug from the hostname (demo on localhost)', () => {
    renderAt('/legal/privacidad')

    // jsdom's default hostname is "localhost" → tenantResolver returns "demo".
    expect(screen.getByTestId('legal-view')).toHaveAttribute('data-tenant', 'demo')
  })

  it('shows a 404 for an unknown slug instead of the legal view', () => {
    renderAt('/legal/inexistente')

    expect(screen.queryByTestId('legal-view')).toBeNull()
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })
})
