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
 * Request body expected by `POST /api/orders`. The cart collects UI-shaped
 * `OrderData`; this is the backend contract the service maps it to (cart items
 * reduced to `{ productId, quantity }`, customer fields as `contact*`).
 * `tenantId` is always the tenant slug, never a UUID.
 */
interface OrderRequestBody {
  tenantId: string
  items: { productId: string; quantity: number }[]
  contactName: string
  contactEmail: string
  contactPhone: string
}

/**
 * Fetches the public materials catalog for a tenant.
 *
 * @param tenantId - Tenant slug whose catalog to fetch (not a UUID).
 * @returns The list of available products.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function getProducts(tenantId: string): Promise<ProductItem[]> {
  const query = new URLSearchParams({ tenantId })
  return apiClient<ProductItem[]>(`/api/products/public?${query.toString()}`, { method: 'GET' })
}

/**
 * Places a materials order (guest checkout, no login required), scoped to the
 * tenant. Maps the cart's `OrderData` to the backend's `/api/orders` contract.
 *
 * @param tenantId - Tenant slug the order belongs to (not a UUID).
 * @param data - The cart items and customer contact data.
 * @returns The created order reference.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function submitOrder(tenantId: string, data: OrderData): Promise<OrderResponse> {
  const body: OrderRequestBody = {
    tenantId,
    items: data.items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    contactName: data.customerName,
    contactEmail: data.customerEmail,
    contactPhone: data.customerPhone,
  }

  return apiClient<OrderResponse>('/api/orders', { method: 'POST', body })
}
