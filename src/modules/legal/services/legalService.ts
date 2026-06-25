import { apiClient } from '../../../core/http/apiClient'
import type { LegalPage, LegalPageType } from '../models/legal'

/**
 * Fetches the published legal page of the given type for a tenant.
 *
 * @param tenantSlug - Tenant slug the legal page belongs to (not a UUID).
 * @param type - Legal page type (backend enum), e.g. "POLITICA_PRIVACIDAD".
 * @returns The published legal page.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function getLegalPage(tenantSlug: string, type: LegalPageType): Promise<LegalPage> {
  return apiClient<LegalPage>(`/api/legal/${tenantSlug}/${type}`, { method: 'GET' })
}
