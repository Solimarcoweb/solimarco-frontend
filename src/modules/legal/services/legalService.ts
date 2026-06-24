import { apiClient } from '../../../core/http/apiClient'
import type { LegalPage } from '../models/legal'

/**
 * Fetches the published legal page of the given type for a tenant.
 *
 * @param tenantId - Tenant the legal page belongs to.
 * @param slug - Legal page slug, e.g. "privacidad", "cookies", "aviso-legal".
 * @returns The published legal page.
 * @throws {import('../../../core/http/apiClient').ApiError} When the backend responds with a non-2xx status.
 */
export function getLegalPage(tenantId: string, slug: string): Promise<LegalPage> {
  return apiClient<LegalPage>(`/api/legal-pages/${tenantId}/${slug}`, { method: 'GET' })
}
