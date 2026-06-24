/** Sentinel value used when there is no recognisable tenant subdomain. */
export const DEMO_TENANT_ID = 'demo'

/**
 * Extracts the tenant identifier from the current hostname.
 *
 * Rules:
 * - `bm-construccion.solimarco.es` → `"bm-construccion"` (production)
 * - `bm-construccion.localhost`     → `"bm-construccion"` (local dev)
 * - `solimarco.es` / `localhost`    → `"demo"` (no subdomain)
 *
 * @returns The tenant slug, or `"demo"` when no subdomain is present.
 */
export function getCurrentTenantId(): string {
  const hostname = window.location.hostname

  const productionMatch = /^([^.]+)\.solimarco\.es$/.exec(hostname)
  if (productionMatch) return productionMatch[1]

  const localhostMatch = /^([^.]+)\.localhost$/.exec(hostname)
  if (localhostMatch) return localhostMatch[1]

  return DEMO_TENANT_ID
}
