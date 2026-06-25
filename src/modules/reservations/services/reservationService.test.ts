import { afterEach, describe, expect, it, vi } from 'vitest'
import type { BudgetFormData } from '../models/reservation'
import { submitBudgetRequest } from './reservationService'

// Mock the HTTP layer so we can assert the exact body sent to the backend
// without performing a real network request.
vi.mock('../../../core/http/apiClient', () => ({
  apiClient: vi.fn().mockResolvedValue({ id: 'lead-1', status: 'pendiente' }),
}))

const { apiClient } = await import('../../../core/http/apiClient')
const apiClientMock = vi.mocked(apiClient)

const formData: BudgetFormData = {
  name: 'María Hernández',
  phone: '600123456',
  email: 'maria@example.com',
  serviceType: 'reforma-integral',
  description: 'Reforma integral de un piso de 90 m².',
  preferredDate: '2026-07-01',
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('submitBudgetRequest', () => {
  it('maps the form data to the backend /api/reservations contract', async () => {
    await submitBudgetRequest('bm-construccion', formData)

    expect(apiClientMock).toHaveBeenCalledWith('/api/reservations', {
      method: 'POST',
      body: {
        tenantId: 'bm-construccion',
        contactName: 'María Hernández',
        contactEmail: 'maria@example.com',
        contactPhone: '600123456',
        date: '2026-07-01',
        details: {
          serviceType: 'reforma-integral',
          description: 'Reforma integral de un piso de 90 m².',
        },
      },
    })
  })

  it('sends the tenant slug as tenantId, not a UUID', async () => {
    await submitBudgetRequest('bm-construccion', formData)

    const body = apiClientMock.mock.calls[0][1]?.body as { tenantId: string }
    expect(body.tenantId).toBe('bm-construccion')
  })

  it('omits date when no preferred date was provided', async () => {
    await submitBudgetRequest('bm-construccion', { ...formData, preferredDate: undefined })

    const body = apiClientMock.mock.calls[0][1]?.body as Record<string, unknown>
    expect(body.date).toBeUndefined()
  })
})
