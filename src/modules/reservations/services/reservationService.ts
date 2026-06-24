import { apiClient } from '../../../core/http/apiClient'
import type { BudgetFormData } from '../models/reservation'

/**
 * Backend response for a created reservation/lead.
 * Shape is provisional and will be aligned with the real `/api/reservations`
 * DTO when the backend endpoint is built (see CLAUDE.md "cambio sincronizado").
 */
export interface ReservationResponse {
  id: string
  status: string
}

/**
 * Sends a construction/reform budget request to the backend as a new lead.
 *
 * @param data - Validated budget form data.
 * @returns The created reservation/lead reference.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function submitBudgetRequest(data: BudgetFormData): Promise<ReservationResponse> {
  return apiClient<ReservationResponse>('/api/reservations', {
    method: 'POST',
    body: data,
  })
}
