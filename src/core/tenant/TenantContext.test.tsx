import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { TenantConfig } from './tenantConfig'

const MOCK_CONFIG: TenantConfig = {
  tenantId: 'demo-tenant',
  businessName: 'Demo Business',
  themeName: 'clasico',
  pageType: 'landing',
  sector: 'generico',
  locale: 'es',
}

vi.mock('./useTenant')

describe('TenantProvider', () => {
  it('shows a loading indicator while the config is being fetched', async () => {
    const { useTenant } = await import('./useTenant')
    vi.mocked(useTenant).mockReturnValue({ status: 'loading' })

    const { TenantProvider } = await import('./TenantContext')
    render(
      <TenantProvider>
        <div>children</div>
      </TenantProvider>,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('children')).not.toBeInTheDocument()
  })

  it('renders children once the config is loaded', async () => {
    const { useTenant } = await import('./useTenant')
    vi.mocked(useTenant).mockReturnValue({ status: 'success', config: MOCK_CONFIG })

    const { TenantProvider } = await import('./TenantContext')
    render(
      <TenantProvider>
        <div>children</div>
      </TenantProvider>,
    )

    expect(screen.getByText('children')).toBeInTheDocument()
  })

  it('shows an error screen when the config request fails', async () => {
    const { useTenant } = await import('./useTenant')
    vi.mocked(useTenant).mockReturnValue({ status: 'error', message: 'Network failure' })

    const { TenantProvider } = await import('./TenantContext')
    render(
      <TenantProvider>
        <div>children</div>
      </TenantProvider>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/network failure/i)).toBeInTheDocument()
    expect(screen.queryByText('children')).not.toBeInTheDocument()
  })
})
