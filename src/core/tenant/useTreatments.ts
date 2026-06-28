import { getTreatments, type TreatmentCategory } from './tenantResources'
import { useTenantResource, type ResourceState } from './useTenantResource'

/**
 * Resolves the current tenant's treatments from
 * `GET /api/tenants/{slug}/treatments`.
 *
 * @returns The loading / success / error state of the treatment categories.
 */
export function useTreatments(): ResourceState<TreatmentCategory[]> {
  return useTenantResource('treatments', getTreatments)
}
