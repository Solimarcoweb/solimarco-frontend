import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppProviders } from './AppProviders'

const mockUseTenantBranding = vi.fn()

vi.mock('../core/tenant/useTenant', () => ({
  useTenant: vi.fn().mockReturnValue({
    status: 'success',
    config: {
      tenantId: 'demo',
      businessName: 'Demo',
      themeName: 'clasico',
      siteType: 'LANDING',
      sector: 'generico',
      locale: 'es',
      primaryColor: '#E63946',
      faviconUrl: 'https://example.com/favicon.ico',
    },
  }),
}))

vi.mock('../core/tenant/useTenantBranding', () => ({
  useTenantBranding: (config: unknown) => mockUseTenantBranding(config),
}))

afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
  mockUseTenantBranding.mockClear()
})

describe('AppProviders', () => {
  it('renders children when the tenant config loads successfully', () => {
    render(
      <AppProviders>
        <div>content</div>
      </AppProviders>,
    )

    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('applies the tenant theme once the config is resolved', () => {
    render(
      <AppProviders>
        <div>content</div>
      </AppProviders>,
    )

    expect(document.documentElement.getAttribute('data-theme')).toBe('clasico')
  })

  it('calls useTenantBranding with the resolved config', () => {
    render(
      <AppProviders>
        <div>content</div>
      </AppProviders>,
    )

    expect(mockUseTenantBranding).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 'demo',
        primaryColor: '#E63946',
        faviconUrl: 'https://example.com/favicon.ico',
      }),
    )
  })
})
