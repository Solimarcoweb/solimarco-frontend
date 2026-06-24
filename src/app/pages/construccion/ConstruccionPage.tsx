import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './ConstruccionPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { LanguageSelector } from '../../../shared/components/LanguageSelector'
import { ProjectGallery, type ProjectItem } from '../../../shared/components/ProjectGallery'
import { Footer, type LegalLink } from '../../../shared/components/Footer'
import { BudgetForm } from '../../../modules/reservations/components/BudgetForm'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { SUPPORTED_LOCALES } from '../../../i18n'
import { applyTheme } from '../../../themes'
import { useOptionalTenantConfig } from '../../../core/tenant/TenantContext'

/** Tenant identifier for the construction/reform pilot (BM Construcción S.L.). */
const TENANT_ID = 'bm-construccion'

/** Canonical site URL of the tenant; the construction page is the landing route. */
const PAGE_URL = 'https://www.bmconstruccionsl.com/construccion'

/** Real business data for BM Construcción S.L. (Tenerife). */
const BUSINESS = {
  name: 'BM Construcción S.L.',
  address: 'Calle La Hornera 48, 38320 San Cristóbal de La Laguna, Santa Cruz de Tenerife',
  phone: '+34 922 65 41 30',
  email: 'info@bmconstruccionsl.com',
} as const

const LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
  { label: 'Términos de venta', href: '/legal/terminos-venta' },
]

/**
 * Four real BM Construcción projects, reused from the ProjectGallery story.
 * In production these come from the backend; hardcoded here for the pilot.
 */
const PROJECTS: ProjectItem[] = [
  {
    id: 'reforma-bano-la-laguna',
    category: 'Reforma de baño',
    title: 'Baño completo en La Laguna',
    description:
      'Sustitución de bañera por plato de ducha extraplano, alicatado porcelánico de gran formato y mobiliario suspendido. Tres semanas de obra.',
    imageUrl: 'https://picsum.photos/seed/bano-la-laguna/800/600',
  },
  {
    id: 'cocina-santa-cruz',
    category: 'Reforma de cocina',
    title: 'Cocina abierta en Santa Cruz',
    description:
      'Apertura del tabique al salón, encimera de cuarzo compacto e iluminación lineal LED bajo los muebles altos.',
    imageUrl: 'https://picsum.photos/seed/cocina-santa-cruz/800/600',
  },
  {
    id: 'obra-nueva-adeje',
    category: 'Obra nueva',
    title: 'Vivienda unifamiliar en Adeje',
    description:
      'Construcción llave en mano de 180 m² en dos plantas, con porche cubierto y piscina desbordante orientada al sur.',
    imageUrl: 'https://picsum.photos/seed/obra-nueva-adeje/800/600',
  },
  {
    id: 'reforma-integral-puerto-cruz',
    category: 'Reforma integral',
    title: 'Piso reformado en Puerto de la Cruz',
    description:
      'Reforma completa de 95 m²: instalaciones de fontanería y electricidad nuevas, suelo SPC y carpintería de aluminio con rotura de puente térmico.',
    imageUrl: 'https://picsum.photos/seed/reforma-puerto-cruz/800/600',
  },
]

const SEO_DESCRIPTION =
  'Más de 25 años de obra nueva y reformas integrales en Tenerife. Solicita presupuesto sin compromiso a BM Construcción S.L.'

/**
 * schema.org structured data for BM Construcción S.L.
 * Uses `GeneralContractor`, a specific subtype of `LocalBusiness`, for more
 * accurate construction-sector signals to search engines.
 */
const LOCAL_BUSINESS_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: BUSINESS.name,
  description: SEO_DESCRIPTION,
  url: PAGE_URL,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle La Hornera 48',
    postalCode: '38320',
    addressLocality: 'San Cristóbal de La Laguna',
    addressRegion: 'Santa Cruz de Tenerife',
    addressCountry: 'ES',
  },
  areaServed: 'Tenerife',
}

/**
 * Landing page for the construction/reform pilot sector (BM Construcción S.L.).
 * Composes the existing shared blocks in order (Hero → ProjectGallery →
 * BudgetForm → Footer) under the `clasico` theme, with a minimal header,
 * page-view tracking and SEO/structured-data tags.
 */
export default function ConstruccionPage() {
  const { i18n } = useTranslation()
  const tenantConfig = useOptionalTenantConfig()

  // Force the trust-first `clasico` theme for this pilot page regardless of the
  // app-level default (AppProviders applies clasico by default; this keeps the
  // page correct even if a future tenant default differs).
  useEffect(() => {
    applyTheme('clasico')
  }, [])

  usePageTracking(TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Construcción y Reformas en Tenerife | BM Construcción S.L."
        description={SEO_DESCRIPTION}
        canonicalUrl={PAGE_URL}
      />
      <SharedJsonLd schema={LOCAL_BUSINESS_SCHEMA} />

      <header className={styles.header}>
        <span className={styles.brand}>{BUSINESS.name}</span>
        <LanguageSelector
          availableLocales={[...SUPPORTED_LOCALES]}
          currentLocale={i18n.language}
        />
      </header>

      <main>
        <Hero
          title="Construcción y Reformas en Tenerife"
          subtitle="Más de 25 años transformando hogares y negocios en la isla"
          ctaLabel="Solicitar presupuesto"
          ctaHref="#presupuesto"
          logoUrl={tenantConfig?.logoUrl}
        />

        <ProjectGallery items={PROJECTS} />

        <section id="presupuesto" className={styles.budget} aria-labelledby="budget-heading">
          <h2 id="budget-heading" className={styles.budgetHeading}>
            Solicita tu presupuesto
          </h2>
          <BudgetForm />
        </section>
      </main>

      <Footer
        businessName={BUSINESS.name}
        address={BUSINESS.address}
        phone={BUSINESS.phone}
        email={BUSINESS.email}
        legalLinks={LEGAL_LINKS}
      />
    </>
  )
}
