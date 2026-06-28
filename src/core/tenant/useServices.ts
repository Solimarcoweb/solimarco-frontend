import { getServices, type TenantService } from './tenantResources'
import { useTenantResource, type ResourceState } from './useTenantResource'

/**
 * Resolves the current tenant's services from `GET /api/tenants/{slug}/services`.
 *
 * @returns The loading / success / error state of the services list.
 */
export function useServices(): ResourceState<TenantService[]> {
  return useTenantResource('services', getServices)
}
