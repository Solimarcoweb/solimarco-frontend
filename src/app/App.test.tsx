import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('../core/tenant/useTenant', () => ({
  useTenant: vi.fn().mockReturnValue({
    status: 'success',
    config: {
      tenantId: 'demo',
      businessName: 'Servicios Profesionales Tenerife',
      themeName: 'clasico',
      siteType: 'LANDING',
      sector: 'generico',
      locale: 'es',
    },
  }),
}))

// The generico landing is data-driven (loading gate on services + hours); stub
// the resource hooks so the hero renders in this integration smoke test.
vi.mock('../core/tenant/useServices', () => ({
  useServices: () => ({ status: 'success', data: [] }),
}))
vi.mock('../core/tenant/useBusinessHours', () => ({
  useBusinessHours: () => ({ status: 'success', data: { weekly: [], upcomingExceptions: [] } }),
}))

describe('App', () => {
  it('mounts the providers and renders the home route', async () => {
    render(<App />)

    // The home route is lazy-loaded behind Suspense, so the heading only
    // appears after the dynamic import resolves. Give waitFor an explicit
    // timeout rather than relying on the 1s default, which can be exceeded
    // when the full suite runs under load.
    // TenantRouter resolves to GenericoLandingPage (sector: generico, siteType: LANDING).
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
