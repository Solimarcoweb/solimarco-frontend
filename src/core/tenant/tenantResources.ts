import { apiClient } from '../http/apiClient'

/**
 * Per-tenant content endpoints. These mirror the backend contracts exactly; the
 * shapes are mapped to the shared component props by `tenantContentMappers`.
 */

/** A service offered by the tenant (`GET /api/tenants/{slug}/services`). */
export interface TenantService {
  id: string
  name: string
  description: string
  imageUrl: string
  /** Sort order within the list. */
  displayOrder: number
}

/** A portfolio project of the tenant (`GET /api/tenants/{slug}/projects`). */
export interface TenantProject {
  id: string
  name: string
  description: string
  imageUrl: string
  category: string
  /** Sort order within the list. */
  displayOrder: number
}

/** Day-of-week enum as returned by the backend. */
export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

/** Opening hours for a single weekday, with an optional midday break. */
export interface WeeklyHours {
  /** Day of week as returned by the backend, e.g. `"MONDAY"`. */
  dayOfWeek: Weekday
  closed: boolean
  morningOpen: string | null
  morningClose: string | null
  afternoonOpen: string | null
  afternoonClose: string | null
}

/** A one-off opening-hours exception (holiday, special closure…). */
export interface HoursException {
  id: string
  /** ISO date (`yyyy-mm-dd`). */
  date: string
  closed: boolean
  reason: string
}

/** Opening hours of a tenant (`GET /api/tenants/{slug}/hours`). */
export interface TenantHours {
  weekly: WeeklyHours[]
  upcomingExceptions: HoursException[]
}

/** A single menu dish (`GET /api/tenants/{slug}/menu` → category items). */
export interface TenantMenuItem {
  id: string
  name: string
  description: string
  /** Price in euros. */
  price: number
  imageUrl: string
  allergens: string[]
  /** Whether the dish is currently offered. */
  available: boolean
  /** Sort order within the category. */
  displayOrder: number
}

/** A menu category with its dishes (`GET /api/tenants/{slug}/menu`). */
export interface TenantMenuCategory {
  id: string
  name: string
  /** Sort order within the menu. */
  displayOrder: number
  items: TenantMenuItem[]
}

/** A single treatment (`GET /api/tenants/{slug}/treatments` → category items). */
export interface TreatmentItem {
  id: string
  name: string
  description: string
  /** Price in euros. */
  price: number
  /** Session duration in minutes. */
  durationMinutes: number
  imageUrl: string
  /** Whether the treatment is currently offered. */
  available: boolean
  /** Sort order within the category. */
  displayOrder: number
}

/** A treatment category with its treatments (`GET /api/tenants/{slug}/treatments`). */
export interface TreatmentCategory {
  id: string
  name: string
  /** Sort order within the catalogue. */
  displayOrder: number
  items: TreatmentItem[]
}

/**
 * Fetches the services offered by a tenant.
 *
 * @param tenantSlug - Tenant slug (not a UUID).
 * @returns `GET /api/tenants/{slug}/services`.
 * @throws {import('../http/apiClient').ApiError} On a non-2xx response.
 */
export function getServices(tenantSlug: string): Promise<TenantService[]> {
  return apiClient<TenantService[]>(`/api/tenants/${tenantSlug}/services`, { method: 'GET' })
}

/**
 * Fetches the portfolio/projects of a tenant.
 *
 * @param tenantSlug - Tenant slug (not a UUID).
 * @returns `GET /api/tenants/{slug}/projects`.
 * @throws {import('../http/apiClient').ApiError} On a non-2xx response.
 */
export function getProjects(tenantSlug: string): Promise<TenantProject[]> {
  return apiClient<TenantProject[]>(`/api/tenants/${tenantSlug}/projects`, { method: 'GET' })
}

/**
 * Fetches the opening hours of a tenant.
 *
 * @param tenantSlug - Tenant slug (not a UUID).
 * @returns `GET /api/tenants/{slug}/hours`.
 * @throws {import('../http/apiClient').ApiError} On a non-2xx response.
 */
export function getBusinessHours(tenantSlug: string): Promise<TenantHours> {
  return apiClient<TenantHours>(`/api/tenants/${tenantSlug}/hours`, { method: 'GET' })
}

/**
 * Fetches the menu (categories with dishes) of a tenant.
 *
 * @param tenantSlug - Tenant slug (not a UUID).
 * @returns `GET /api/tenants/{slug}/menu`.
 * @throws {import('../http/apiClient').ApiError} On a non-2xx response.
 */
export function getMenu(tenantSlug: string): Promise<TenantMenuCategory[]> {
  return apiClient<TenantMenuCategory[]>(`/api/tenants/${tenantSlug}/menu`, { method: 'GET' })
}

/**
 * Fetches the treatments (categories with items) of a tenant.
 *
 * @param tenantSlug - Tenant slug (not a UUID).
 * @returns `GET /api/tenants/{slug}/treatments`.
 * @throws {import('../http/apiClient').ApiError} On a non-2xx response.
 */
export function getTreatments(tenantSlug: string): Promise<TreatmentCategory[]> {
  return apiClient<TreatmentCategory[]>(`/api/tenants/${tenantSlug}/treatments`, { method: 'GET' })
}
