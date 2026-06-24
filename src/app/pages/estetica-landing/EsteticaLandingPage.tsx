import { useEffect } from 'react'
import styles from './EsteticaLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { TreatmentsList } from '../../../shared/components/TreatmentsList'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import {
  APPOINTMENT_SERVICES,
  BEAUTY_SALON_SCHEMA,
  BUSINESS,
  ESTETICA_TENANT_ID,
  HOURS,
  LEGAL_LINKS,
  SEO_DESCRIPTION,
  SITE_URL,
  TREATMENTS,
} from '../estetica-multi/esteticaData'

/**
 * Landing page for the beauty / aesthetic sector (Centro Estético Magnolia).
 * Composes Hero → TreatmentsList → AppointmentForm → BusinessInfo → Footer
 * under the `editorial` theme. Includes BeautySalon structured data and page tracking.
 */
export default function EsteticaLandingPage() {
  useEffect(() => {
    applyTheme('editorial')
  }, [])

  usePageTracking('demo-estetica')

  return (
    <>
      <SharedSeo
        title="Centro Estético Magnolia | Puerto de la Cruz, Tenerife"
        description={SEO_DESCRIPTION}
        canonicalUrl={SITE_URL}
      />
      <SharedJsonLd schema={BEAUTY_SALON_SCHEMA} />

      <header className={styles.header}>
        <span className={styles.brand}>{BUSINESS.name}</span>
      </header>

      <main>
        <Hero
          title="Centro Estético Magnolia"
          subtitle="Tratamientos faciales, corporales, manicura y depilación láser en Puerto de la Cruz"
          ctaLabel="Ver tratamientos"
          ctaHref="#tratamientos"
          backgroundImage="https://picsum.photos/seed/magnolia-hero/1600/900"
        />

        <section id="tratamientos" aria-label="Catálogo de tratamientos">
          <TreatmentsList treatments={TREATMENTS} heading="Nuestros tratamientos" />
        </section>

        <section className={styles.formSection} aria-labelledby="cita-heading">
          <h2 id="cita-heading" className={styles.formHeading}>
            Pide tu cita
          </h2>
          <AppointmentForm tenantId={ESTETICA_TENANT_ID} services={APPOINTMENT_SERVICES} />
        </section>

        <BusinessInfo
          address={BUSINESS.address}
          phone={BUSINESS.phone}
          email={BUSINESS.email}
          hours={HOURS}
          mapImageUrl="https://picsum.photos/seed/mapa-magnolia/1200/450"
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
