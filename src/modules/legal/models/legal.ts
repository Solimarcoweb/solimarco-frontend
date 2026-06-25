/** Legal page types, mirroring the backend `LegalPageType` enum. */
export type LegalPageType =
  | 'AVISO_LEGAL'
  | 'POLITICA_PRIVACIDAD'
  | 'COOKIES'
  | 'TERMINOS_VENTA'
  | 'POLITICA_ENVIOS'

/**
 * A published legal page for a tenant, mirroring the backend's
 * `LegalPageResponse` from `GET /api/legal/{tenantSlug}/{type}`.
 */
export interface LegalPage {
  id: string
  /** Tenant the page belongs to. */
  tenantId: string
  /** Legal page type (enum). */
  type: LegalPageType
  /** Page body as trusted HTML produced by our own backend (not user input). */
  content: string
  /** Monotonic version of the published content. */
  version: number
  /** ISO-8601 timestamp of publication. */
  publishedAt: string
  /** Whether this is the active/published version. */
  active: boolean
}

/** Human-readable Spanish title rendered as the page H1, per legal type. */
export const LEGAL_PAGE_TITLES: Record<LegalPageType, string> = {
  AVISO_LEGAL: 'Aviso legal',
  POLITICA_PRIVACIDAD: 'Política de privacidad',
  COOKIES: 'Política de cookies',
  TERMINOS_VENTA: 'Términos de venta',
  POLITICA_ENVIOS: 'Política de envíos',
}

/**
 * Maps the public URL slug (e.g. `/legal/privacidad`) to its backend enum type,
 * so router params can be resolved to the `type` the API expects.
 */
export const LEGAL_TYPE_BY_SLUG: Record<string, LegalPageType> = {
  'aviso-legal': 'AVISO_LEGAL',
  privacidad: 'POLITICA_PRIVACIDAD',
  cookies: 'COOKIES',
  'terminos-venta': 'TERMINOS_VENTA',
  envios: 'POLITICA_ENVIOS',
}
