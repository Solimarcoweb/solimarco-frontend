import type { LegalLink } from '../../../shared/components/Footer'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'

/** Multi-tenant theme for the generic / configurable business sector. */
export const GENERICO_THEME = 'clasico'

/** Base path of the multi-page generic site. */
export const GENERICO_BASE_PATH = '/generico-multi'

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
 * Builds schema.org `LocalBusiness` structured data from the tenant config.
 *
 * @param config - Resolved tenant configuration.
 * @param url - Canonical page URL.
 * @returns A JSON-LD object for the generic business.
 */
export function buildLocalBusinessSchema(
  config: TenantConfig,
  url: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: config.businessName,
    description: config.businessDescription,
    url,
    telephone: config.phone,
    email: config.email,
    address: config.address,
  }
}
