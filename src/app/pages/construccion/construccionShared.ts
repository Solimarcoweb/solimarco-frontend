import type { LegalLink } from '../../../shared/components/Footer'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'

/** Multi-tenant theme for the construction sector. */
export const CONSTRUCCION_THEME = 'clasico'

/** Base path of the multi-page construction site. */
export const CONSTRUCCION_BASE_PATH = '/construccion-multi'

/**
 * Legal links shown in the footer. These map to the app-level `/legal/:slug`
 * routes and are the same for every tenant (not tenant-specific data).
 */
export const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
  { label: 'Términos de venta', href: '/legal/terminos-venta' },
]

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA — temporal hasta endpoint/personalización por tenant.
// Estas constantes alimentan secciones del rediseño (hero stats, showroom de
// materiales, testimonios, imagen de hero) que todavía NO tienen contrato de
// backend ni campo en TenantConfig. Cuando exista el endpoint/campo, se migran
// a la capa de datos dinámica como el resto del sector.
// ─────────────────────────────────────────────────────────────────────────────

/** A headline stat shown in the hero band. */
export interface ConstruccionStat {
  /** Display value, e.g. `"200+"`. */
  value: string
  /** i18n key for the label under the value (under the `construccion.stats.*`). */
  labelKey: string
}

/** SAMPLE - temporal hasta endpoint/personalización. */
export const CONSTRUCCION_STATS: ConstruccionStat[] = [
  { value: '12+', labelKey: 'construccion.stats.years' },
  { value: '200+', labelKey: 'construccion.stats.projects' },
  { value: '100%', labelKey: 'construccion.stats.satisfaction' },
]

/** A premium materials brand shown in the showroom grid. */
export interface ConstruccionMaterial {
  /** Brand name, e.g. `"VERSACE"`. */
  name: string
  /** Short line of representative collections/products. */
  detail: string
}

/** SAMPLE - temporal hasta endpoint/personalización. */
export const CONSTRUCCION_MATERIALS: ConstruccionMaterial[] = [
  { name: 'VERSACE', detail: 'Glass · Superbe · Cannete' },
  { name: 'CERAMITALY', detail: 'Oriente · Maison · Madras' },
  { name: 'SPC y PVC', detail: 'UV Board · Honey Oak' },
  { name: 'MURAIA', detail: 'Piezas decorativas' },
]

/** A client testimonial. */
export interface ConstruccionTestimonial {
  /** The quote text. */
  quote: string
  /** Client name. */
  name: string
  /** Client role / location, e.g. `"Arquitecto · Santa Cruz"`. */
  role: string
}

/** SAMPLE - temporal hasta endpoint/personalización. */
export const CONSTRUCCION_TESTIMONIALS: ConstruccionTestimonial[] = [
  {
    quote:
      'El showroom nos resolvió la elección de materiales. Versace y Ceramitaly de primer nivel.',
    name: 'Carlos Díaz',
    role: 'Arquitecto · Santa Cruz',
  },
  {
    quote: 'Reformaron nuestra villa con un acabado impecable y plazos cumplidos al día.',
    name: 'María Hernández',
    role: 'Particular · Adeje',
  },
  {
    quote: 'Profesionalidad de principio a fin. Volveríamos a confiar sin dudarlo.',
    name: 'Laura Pérez',
    role: 'Promotora · Costa Adeje',
  },
]

/**
 * SAMPLE - temporal hasta endpoint/personalización (debería venir del tenant).
 * Background photo used in the hero when the tenant has no own image.
 */
export const CONSTRUCCION_HERO_IMAGE =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80'

/**
 * Builds schema.org `GeneralContractor` structured data from the tenant config.
 *
 * @param config - Resolved tenant configuration.
 * @param url - Canonical page URL.
 * @returns A JSON-LD object for the construction business.
 */
export function buildBusinessSchema(config: TenantConfig, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: config.businessName,
    description: config.businessDescription,
    url,
    telephone: config.phone,
    email: config.email,
    address: config.address,
  }
}
