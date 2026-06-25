import { afterEach, describe, expect, it, vi } from 'vitest'
import type { OrderData } from '../models/product'
import { getProducts, submitOrder } from './salesService'

// Mock the HTTP layer so we can assert the exact path/body sent to the backend
// without performing a real network request.
vi.mock('../../../core/http/apiClient', () => ({
  apiClient: vi.fn().mockResolvedValue({ id: 'order-1', status: 'pendiente' }),
}))

const { apiClient } = await import('../../../core/http/apiClient')
const apiClientMock = vi.mocked(apiClient)

afterEach(() => {
  vi.clearAllMocks()
})

describe('getProducts', () => {
  it('requests the public catalog with the tenant slug as a query param', async () => {
    await getProducts('rincon-canario')

    expect(apiClientMock).toHaveBeenCalledWith('/api/products/public?tenantId=rincon-canario', {
      method: 'GET',
    })
  })

  it('sends the tenant slug, not a UUID', async () => {
    await getProducts('rincon-canario')

    const path = apiClientMock.mock.calls[0][0]
    expect(path).toContain('tenantId=rincon-canario')
  })
})

describe('submitOrder', () => {
  const order: OrderData = {
    items: [
      {
        id: 'cemento-cem-ii-25',
        name: 'Cemento gris CEM II 25 kg',
        description: 'Cemento de uso general.',
        price: 8.45,
        unit: 'saco',
        category: 'Cemento y áridos',
        quantity: 10,
      },
      {
        id: 'pintura-plastica-blanca-15',
        name: 'Pintura plástica blanca mate 15 L',
        description: 'Pintura interior lavable.',
        price: 34.5,
        unit: 'cubo',
        category: 'Pinturas y barnices',
        quantity: 2,
      },
    ],
    customerName: 'María Hernández',
    customerEmail: 'maria@example.com',
    customerPhone: '600123456',
  }

  it('maps the cart to the backend /api/orders contract', async () => {
    await submitOrder('rincon-canario', order)

    expect(apiClientMock).toHaveBeenCalledWith('/api/orders', {
      method: 'POST',
      body: {
        tenantId: 'rincon-canario',
        items: [
          { productId: 'cemento-cem-ii-25', quantity: 10 },
          { productId: 'pintura-plastica-blanca-15', quantity: 2 },
        ],
        contactName: 'María Hernández',
        contactEmail: 'maria@example.com',
        contactPhone: '600123456',
      },
    })
  })

  it('reduces cart items to productId + quantity only', async () => {
    await submitOrder('rincon-canario', order)

    const body = apiClientMock.mock.calls[0][1]?.body as { items: Record<string, unknown>[] }
    expect(body.items.every((item) => Object.keys(item).sort().join() === 'productId,quantity')).toBe(
      true,
    )
  })
})
