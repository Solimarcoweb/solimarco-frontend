import type { SupportedLocale } from '../../i18n'

/** Shape of the tenant configuration returned by `GET /api/tenants/{tenantId}/config`. */
export interface TenantConfig {
  tenantId: string
  businessName: string
  /** CSS theme name; maps to a `theme-*.css` bundle. */
  themeName: string
  /** Whether the site is a single landing page or a multi-page site. */
  pageType: 'landing' | 'multi'
  /** Business sector slug (e.g. `"construccion"`, `"restaurante"`). */
  sector: string
  /** Default UI locale for this tenant. */
  locale: SupportedLocale
}
