import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { TenantConfig } from './tenantConfig'

/** Clears the module-level cache between tests by re-importing a fresh module. */
vi.mock('./tenantResolver', () => ({
  getCurrentTenantId: vi.fn().mockReturnValue('demo-tenant'),
}))

vi.mock('../http/apiClient')

const MOCK_CONFIG: TenantConfig = {
  tenantId: 'demo-tenant',
  businessName: 'Demo Business',
  themeName: 'clasico',
  siteType: 'LANDING',
  sector: 'generico',
  locale: 'es',
}

describe('useTenant', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts in the loading state', async () => {
    const { apiClient } = await import('../http/apiClient')
    vi.mocked(apiClient).mockReturnValue(new Promise(() => {}))

    const { useTenant } = await import('./useTenant')
    const { result } = renderHook(() => useTenant())

    expect(result.current.status).toBe('loading')
  })

  it('transitions to success when the API resolves', async () => {
    const { apiClient } = await import('../http/apiClient')
    vi.mocked(apiClient).mockResolvedValue(MOCK_CONFIG)

    const { useTenant } = await import('./useTenant')
    const { result } = renderHook(() => useTenant())

    await waitFor(() => expect(result.current.status).toBe('success'))

    if (result.current.status === 'success') {
      expect(result.current.config).toEqual(MOCK_CONFIG)
    }
  })

  it('transitions to error when the API rejects', async () => {
    const { apiClient } = await import('../http/apiClient')
    vi.mocked(apiClient).mockRejectedValue(new Error('Network failure'))

    const { useTenant } = await import('./useTenant')
    const { result } = renderHook(() => useTenant())

    await waitFor(() => expect(result.current.status).toBe('error'))

    if (result.current.status === 'error') {
      expect(result.current.message).toMatch(/network failure/i)
    }
  })
})
