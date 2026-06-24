import { apiClient } from '../../../core/http/apiClient'
import type { AppointmentData, BudgetFormData, TableReservationData } from '../models/reservation'

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

/**
 * Sends a table reservation to the backend as a new reservation, scoped to the
 * tenant. Reuses the shared `/api/reservations` endpoint.
 *
 * @param tenantId - Tenant the reservation belongs to.
 * @param data - Validated table reservation data.
 * @returns The created reservation reference.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function submitTableReservation(
  tenantId: string,
  data: TableReservationData,
): Promise<ReservationResponse> {
  return apiClient<ReservationResponse>('/api/reservations', {
    method: 'POST',
    body: { tenantId, ...data },
  })
}

/**
 * Sends a mechanic appointment request to the backend, scoped to the tenant.
 *
 * @param tenantId - Tenant the appointment belongs to.
 * @param data - Validated appointment data.
 * @returns The created reservation reference.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function submitAppointment(
  tenantId: string,
  data: AppointmentData,
): Promise<ReservationResponse> {
  return apiClient<ReservationResponse>('/api/reservations', {
    method: 'POST',
    body: { tenantId, ...data },
  })
}
