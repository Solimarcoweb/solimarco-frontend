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
  /** URL of the business favicon; falls back to the platform default when absent. */
  faviconUrl?: string
  /** URL of the business logo rendered in the site header and hero. */
  logoUrl?: string
  /** Hex colour override for the theme's primary colour, e.g. `"#E63946"`. */
  primaryColor?: string
  /** Short SEO description used as the `<meta name="description">` fallback. */
  businessDescription?: string
}
