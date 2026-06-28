import { afterEach, describe, expect, it, vi } from 'vitest'
import { getBusinessHours, getProjects, getServices } from './tenantResources'

// Mock the HTTP layer to assert the exact path requested for each resource.
vi.mock('../http/apiClient', () => ({
  apiClient: vi.fn().mockResolvedValue([]),
}))

const { apiClient } = await import('../http/apiClient')
const apiClientMock = vi.mocked(apiClient)

afterEach(() => {
  vi.clearAllMocks()
})

describe('tenant resource services', () => {
  it('getServices requests GET /api/tenants/{slug}/services', async () => {
    await getServices('bm-construccion')
    expect(apiClientMock).toHaveBeenCalledWith('/api/tenants/bm-construccion/services', {
      method: 'GET',
    })
  })

  it('getProjects requests GET /api/tenants/{slug}/projects', async () => {
    await getProjects('bm-construccion')
    expect(apiClientMock).toHaveBeenCalledWith('/api/tenants/bm-construccion/projects', {
      method: 'GET',
    })
  })

  it('getBusinessHours requests GET /api/tenants/{slug}/hours', async () => {
    await getBusinessHours('bm-construccion')
    expect(apiClientMock).toHaveBeenCalledWith('/api/tenants/bm-construccion/hours', {
      method: 'GET',
    })
  })
})
