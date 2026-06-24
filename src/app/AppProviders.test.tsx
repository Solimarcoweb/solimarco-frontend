import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppProviders } from './AppProviders'

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

afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
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
})
