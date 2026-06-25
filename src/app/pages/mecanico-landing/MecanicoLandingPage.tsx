import { useEffect } from 'react'
import styles from './MecanicoLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ServicesList } from '../../../shared/components/ServicesList'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import {
  AUTO_REPAIR_SCHEMA,
  BUSINESS,
  HOURS,
  LEGAL_LINKS,
  MECANICO_TENANT_ID,
  SEO_DESCRIPTION,
  SERVICES,
  SITE_URL,
} from '../mecanico-multi/mecanicoData'

/**
 * Landing page for the mechanic/workshop sector (Taller Mecánico El Teide).
 * Composes Hero → ServicesList → AppointmentForm → BusinessInfo → Footer
 * under the `urbano` theme. Includes AutoRepair structured data and page tracking.
 */
export default function MecanicoLandingPage() {
  useEffect(() => {
    applyTheme('urbano')
  }, [])

  usePageTracking('demo-mecanico')

  return (
    <>
      <SharedSeo
        title="Taller Mecánico El Teide | Taller en La Laguna, Tenerife"
        description={SEO_DESCRIPTION}
        canonicalUrl={SITE_URL}
      />
      <SharedJsonLd schema={AUTO_REPAIR_SCHEMA} />

      <header className={styles.header}>
        <span className={styles.brand}>{BUSINESS.name}</span>
      </header>

      <main>
        <Hero
          title="Taller Mecánico El Teide"
          subtitle="Mecánica, frenos, ITV y mucho más en San Cristóbal de La Laguna"
          ctaLabel="Pedir cita"
          ctaHref="#cita"
          backgroundImage="https://picsum.photos/seed/taller-el-teide/1600/900"
        />

        <ServicesList className={styles.sectionAlt} services={SERVICES} />

        <section id="cita" className={styles.formSection} aria-labelledby="cita-heading">
          <h2 id="cita-heading" className={styles.formHeading}>
            Pide tu cita
          </h2>
          <AppointmentForm tenantId={MECANICO_TENANT_ID} services={SERVICES} />
        </section>

        <BusinessInfo
          className={styles.sectionAlt}
          address={BUSINESS.address}
          phone={BUSINESS.phone}
          email={BUSINESS.email}
          hours={HOURS}
          mapImageUrl="https://picsum.photos/seed/mapa-el-teide/1200/450"
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
