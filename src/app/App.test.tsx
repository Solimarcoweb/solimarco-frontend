import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('../core/tenant/useTenant', () => ({
  useTenant: vi.fn().mockReturnValue({
    status: 'success',
    config: {
      tenantId: 'demo',
      businessName: 'Demo',
      themeName: 'clasico',
      pageType: 'landing',
      sector: 'generico',
      locale: 'es',
    },
  }),
}))

describe('App', () => {
  it('mounts the providers and renders the home route', async () => {
    render(<App />)

    // The home route is lazy-loaded behind Suspense, so the heading only
    // appears after the dynamic import resolves. Give waitFor an explicit
    // timeout rather than relying on the 1s default, which can be exceeded
    // when the full suite runs under load.
    // TenantRouter resolves to GenericoLandingPage (sector: generico, pageType: landing).
    // The hero heading is the tenant's business name rendered as h1.
    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { level: 1, name: /servicios profesionales tenerife/i }),
        ).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})
