import { getProjects, type TenantProject } from './tenantResources'
import { useTenantResource, type ResourceState } from './useTenantResource'

/**
 * Resolves the current tenant's projects from `GET /api/tenants/{slug}/projects`.
 *
 * @returns The loading / success / error state of the projects list.
 */
export function useProjects(): ResourceState<TenantProject[]> {
  return useTenantResource('projects', getProjects)
}
