import type { SupportedLocale } from '../../i18n'

/** Social profile URLs for a tenant; every platform is optional. */
export interface SocialLinks {
  facebook?: string
  instagram?: string
  youtube?: string
  linkedin?: string
  tiktok?: string
  whatsapp?: string
}

/** Optional modules a tenant has enabled; drive conditional sections/routes. */
export interface TenantModules {
  /** Online shop / showroom. */
  hasShop: boolean
  /** Table/visit reservations. */
  hasReservations: boolean
  /** Appointment booking. */
  hasCitas: boolean
  /** Budget/quote request form. */
  hasBudgetForm: boolean
}

/**
 * Shape of the tenant configuration returned by `GET /api/tenants/{tenantId}/config`.
 * Holds branding/routing plus the business contact details and enabled modules.
 * The per-sector content (services, projects, hours) comes from the dedicated
 * `/services`, `/projects` and `/hours` endpoints, not from here.
 */
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
  /** Contact phone in human-readable form. */
  phone?: string
  /** Contact email. */
  email?: string
  /** Postal address (single line or comma-separated). */
  address?: string
  /** Social profile URLs. */
  socialLinks?: SocialLinks
  /** Enabled optional modules. */
  modules?: TenantModules
}
