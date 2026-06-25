import { afterEach, describe, expect, it, vi } from 'vitest'
import { getLegalPage } from './legalService'

// Mock the HTTP layer so we can assert the exact path requested without
// performing a real network request.
vi.mock('../../../core/http/apiClient', () => ({
  apiClient: vi.fn().mockResolvedValue({
    id: 'legal-1',
    tenantId: 'bm-construccion',
    type: 'POLITICA_PRIVACIDAD',
    content: '<p>…</p>',
    version: 1,
    publishedAt: '2026-03-14T09:00:00Z',
    active: true,
  }),
}))

const { apiClient } = await import('../../../core/http/apiClient')
const apiClientMock = vi.mocked(apiClient)

afterEach(() => {
  vi.clearAllMocks()
})

describe('getLegalPage', () => {
  it('requests GET /api/legal/{tenantSlug}/{type} with the enum type', async () => {
    await getLegalPage('bm-construccion', 'POLITICA_PRIVACIDAD')

    expect(apiClientMock).toHaveBeenCalledWith('/api/legal/bm-construccion/POLITICA_PRIVACIDAD', {
      method: 'GET',
    })
  })

  it('uses the given type verbatim in the path for each legal type', async () => {
    await getLegalPage('bm-construccion', 'TERMINOS_VENTA')

    expect(apiClientMock).toHaveBeenCalledWith('/api/legal/bm-construccion/TERMINOS_VENTA', {
      method: 'GET',
    })
  })
})
