import type { LegalLink } from '../../../shared/components/Footer'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'

/** Multi-tenant theme for the mechanic/workshop sector. */
export const MECANICO_THEME = 'urbano'

/** Base path of the multi-page mechanic site. */
export const MECANICO_BASE_PATH = '/mecanico-multi'

/**
 * Legal links shown in the footer. These map to the app-level `/legal/:slug`
 * routes and are the same for every tenant (not tenant-specific data).
 */
export const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
]

/**
 * Builds schema.org `AutoRepair` structured data from the tenant config.
 *
 * @param config - Resolved tenant configuration.
 * @param url - Canonical page URL.
 * @returns A JSON-LD object for the mechanic business.
 */
export function buildAutoRepairSchema(config: TenantConfig, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: config.businessName,
    description: config.businessDescription,
    url,
    telephone: config.phone,
    email: config.email,
    address: config.address,
  }
}
