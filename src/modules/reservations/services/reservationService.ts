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
 * Request body expected by `POST /api/reservations`, shared by every sector.
 * Forms collect UI-shaped data; each service maps it to this contract
 * (`name → contactName`, `phone → contactPhone`, sector-specific fields under
 * `details`). `tenantId` is always the tenant slug, never a UUID.
 */
interface ReservationRequestBody {
  tenantId: string
  contactName: string
  contactEmail: string
  contactPhone: string
  /** Event date/datetime (ISO-8601); omitted when the form gave none. */
  date?: string
  details: Record<string, unknown>
}

/**
 * Combines a `yyyy-mm-dd` date and an `HH:MM` time into a single ISO-8601 local
 * datetime string (`yyyy-mm-ddTHH:MM`). Returns the date alone when there is no
 * time, and `undefined` when there is no date, so an empty date is omitted from
 * the request body.
 *
 * @param date - Date part as `yyyy-mm-dd`, or empty.
 * @param time - Time part as `HH:MM`, or empty.
 * @returns The combined ISO datetime, the date alone, or `undefined`.
 */
function combineDateTime(date?: string, time?: string): string | undefined {
  const datePart = date?.trim()
  const timePart = time?.trim()
  if (!datePart) return undefined
  return timePart ? `${datePart}T${timePart}` : datePart
}

/**
 * POSTs a reservation/lead to `/api/reservations`.
 *
 * @param body - Request body already mapped to the backend contract.
 * @returns The created reservation/lead reference.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
function postReservation(body: ReservationRequestBody): Promise<ReservationResponse> {
  return apiClient<ReservationResponse>('/api/reservations', {
    method: 'POST',
    body,
  })
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
  return postReservation({
    tenantId,
    contactName: data.name,
    contactEmail: data.email,
    contactPhone: data.phone,
    date: combineDateTime(data.preferredDate),
    details: {
      serviceType: data.serviceType,
      description: data.description,
    },
  })
}

/**
 * Sends a table reservation to the backend, scoped to the tenant, mapping the
 * form's `TableReservationData` to the shared `/api/reservations` contract.
 *
 * @param tenantId - Tenant slug the reservation belongs to (not a UUID).
 * @param data - Validated table reservation data.
 * @returns The created reservation reference.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function submitTableReservation(
  tenantId: string,
  data: TableReservationData,
): Promise<ReservationResponse> {
  return postReservation({
    tenantId,
    contactName: data.name,
    contactEmail: data.email,
    contactPhone: data.phone,
    date: combineDateTime(data.date, data.time),
    details: {
      guests: data.guests,
      notes: data.notes,
    },
  })
}

/**
 * Sends a mechanic/beauty appointment request to the backend, scoped to the
 * tenant, mapping the form's `AppointmentData` to the shared
 * `/api/reservations` contract.
 *
 * @param tenantId - Tenant slug the appointment belongs to (not a UUID).
 * @param data - Validated appointment data.
 * @returns The created reservation reference.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function submitAppointment(
  tenantId: string,
  data: AppointmentData,
): Promise<ReservationResponse> {
  return postReservation({
    tenantId,
    contactName: data.name,
    contactEmail: data.email,
    contactPhone: data.phone,
    date: combineDateTime(data.preferredDate, data.preferredTime),
    details: {
      serviceId: data.serviceId,
      vehicleBrand: data.vehicleBrand,
      vehicleModel: data.vehicleModel,
      notes: data.notes,
    },
  })
}
