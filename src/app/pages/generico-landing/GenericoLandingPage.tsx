import { useEffect } from 'react'
import styles from './GenericoLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ServicesList } from '../../../shared/components/ServicesList'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { BudgetForm } from '../../../modules/reservations/components/BudgetForm'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import {
  BUSINESS,
  GENERICO_TENANT_ID,
  HOURS,
  LEGAL_LINKS,
  LOCAL_BUSINESS_SCHEMA,
  SEO_DESCRIPTION,
  SERVICES,
  SITE_URL,
} from '../generico-multi/genericoData'

/**
 * Landing page for the generic / configurable business sector
 * (Servicios Profesionales Tenerife).
 * Composes Hero → ServicesList → BudgetForm → BusinessInfo → Footer
 * under the `clasico` theme. Includes LocalBusiness structured data and page tracking.
 */
export default function GenericoLandingPage() {
  useEffect(() => {
    applyTheme('clasico')
  }, [])

  usePageTracking(GENERICO_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Servicios Profesionales Tenerife | Santa Cruz de Tenerife"
        description={SEO_DESCRIPTION}
        canonicalUrl={SITE_URL}
      />
      <SharedJsonLd schema={LOCAL_BUSINESS_SCHEMA} />

      <header className={styles.header}>
        <span className={styles.brand}>{BUSINESS.name}</span>
      </header>

      <main>
        <Hero
          title="Servicios Profesionales Tenerife"
          subtitle="Consultoría, gestión, formación y tramitaciones para empresas y particulares en Tenerife"
          ctaLabel="Ver servicios"
          ctaHref="#servicios"
          backgroundImage="https://picsum.photos/seed/generico-hero/1600/900"
        />

        <section id="servicios" className={styles.sectionAlt} aria-label="Servicios profesionales">
          <ServicesList services={SERVICES} heading="Nuestros servicios" />
        </section>

        <section className={styles.formSection} aria-labelledby="presupuesto-heading">
          <div className={styles.formInner}>
            <h2 id="presupuesto-heading" className={styles.formHeading}>
              Solicitar presupuesto
            </h2>
            <p className={styles.formIntro}>
              Sin compromiso. Te respondemos en menos de 24 horas laborables.
            </p>
            <BudgetForm tenantId={GENERICO_TENANT_ID} />
          </div>
        </section>

        <BusinessInfo
          className={styles.sectionAlt}
          address={BUSINESS.address}
          phone={BUSINESS.phone}
          email={BUSINESS.email}
          hours={HOURS}
          mapImageUrl="https://picsum.photos/seed/mapa-generico/1200/450"
        />
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
