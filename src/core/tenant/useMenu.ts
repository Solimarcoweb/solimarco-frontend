import { getMenu, type TenantMenuCategory } from './tenantResources'
import { useTenantResource, type ResourceState } from './useTenantResource'

/**
 * Resolves the current tenant's menu from `GET /api/tenants/{slug}/menu`.
 *
 * @returns The loading / success / error state of the menu categories.
 */
export function useMenu(): ResourceState<TenantMenuCategory[]> {
  return useTenantResource('menu', getMenu)
}
