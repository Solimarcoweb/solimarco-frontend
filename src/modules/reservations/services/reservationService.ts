import { apiClient } from '../../../core/http/apiClient'
import type {
  AppointmentData,
  BudgetFormData,
  ServiceType,
  TableReservationData,
} from '../models/reservation'

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
 * Request body expected by `POST /api/reservations` for a budget lead. The form
 * collects UI-shaped `BudgetFormData`; this is the backend contract the service
 * maps it to (`name → contactName`, `phone → contactPhone`, sector-specific
 * fields under `details`). `tenantId` is the tenant slug, never a UUID.
 */
interface BudgetRequestBody {
  tenantId: string
  contactName: string
  contactEmail: string
  contactPhone: string
  /** Preferred date (ISO `yyyy-mm-dd`); omitted when the client gave none. */
  date?: string
  details: {
    serviceType: ServiceType
    description: string
  }
}

/**
 * Sends a construction/reform budget request to the backend as a new lead,
 * scoped to the tenant. Maps the form's `BudgetFormData` to the backend's
 * `/api/reservations` contract.
 *
 * @param tenantId - Tenant slug the lead belongs to (not a UUID).
 * @param data - Validated budget form data.
 * @returns The created reservation/lead reference.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function submitBudgetRequest(
  tenantId: string,
  data: BudgetFormData,
): Promise<ReservationResponse> {
  const body: BudgetRequestBody = {
    tenantId,
    contactName: data.name,
    contactEmail: data.email,
    contactPhone: data.phone,
    date: data.preferredDate?.trim() ? data.preferredDate : undefined,
    details: {
      serviceType: data.serviceType,
      description: data.description,
    },
  }

  return apiClient<ReservationResponse>('/api/reservations', {
    method: 'POST',
    body,
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
