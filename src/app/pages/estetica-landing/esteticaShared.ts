import type { LegalLink } from '../../../shared/components/Footer'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'

/** Multi-tenant theme for the beauty/aesthetic sector. */
export const ESTETICA_THEME = 'editorial'

/** Base path of the multi-page estetica site. */
export const ESTETICA_BASE_PATH = '/estetica-multi'

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
 * Builds schema.org `BeautySalon` structured data from the tenant config.
 *
 * @param config - Resolved tenant configuration.
 * @param url - Canonical page URL.
 * @returns A JSON-LD object for the beauty salon.
 */
export function buildBeautySalonSchema(config: TenantConfig, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: config.businessName,
    description: config.businessDescription,
    url,
    telephone: config.phone,
    email: config.email,
    address: config.address,
  }
}
