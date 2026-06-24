import { apiClient } from '../../../core/http/apiClient'
import type { OrderData, ProductItem } from '../models/product'

/**
 * Backend response for a created order.
 * Shape is provisional and will be aligned with the real `/api/orders` DTO
 * when the backend endpoint is built (see CLAUDE.md "cambio sincronizado").
 */
export interface OrderResponse {
  id: string
  status: string
}

/**
 * Fetches the materials catalog for the current tenant.
 *
 * @returns The list of available products.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function getProducts(): Promise<ProductItem[]> {
  return apiClient<ProductItem[]>('/api/products', { method: 'GET' })
}

/**
 * Places a materials order (guest checkout, no login required).
 *
 * @param order - The order payload, including cart items and customer contact data.
 * @returns The created order reference.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function submitOrder(order: OrderData): Promise<OrderResponse> {
  return apiClient<OrderResponse>('/api/orders', { method: 'POST', body: order })
}
