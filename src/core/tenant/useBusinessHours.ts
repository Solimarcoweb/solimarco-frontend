import { getBusinessHours, type TenantHours } from './tenantResources'
import { useTenantResource, type ResourceState } from './useTenantResource'

/**
 * Resolves the current tenant's opening hours from `GET /api/tenants/{slug}/hours`.
 *
 * @returns The loading / success / error state of the opening hours.
 */
export function useBusinessHours(): ResourceState<TenantHours> {
  return useTenantResource('hours', getBusinessHours)
}
