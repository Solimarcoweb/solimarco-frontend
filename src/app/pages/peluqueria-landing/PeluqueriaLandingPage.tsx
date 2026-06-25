import { useEffect } from 'react'
import styles from './PeluqueriaLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { Reveal } from '../../../shared/components/Reveal'
import { ServicesList } from '../../../shared/components/ServicesList'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import {
  APPOINTMENT_SERVICES,
  BUSINESS,
  HAIR_SALON_SCHEMA,
  HOURS,
  LEGAL_LINKS,
  PELUQUERIA_TENANT_ID,
  SEO_DESCRIPTION,
  SERVICES,
  SITE_URL,
} from '../peluqueria-multi/peluqueriaData'

/**
 * Landing page for the hairdresser sector (Peluquería Brisa Atlántica).
 * Composes Hero → ServicesList → AppointmentForm → BusinessInfo → Footer
 * under the `mediterraneo` theme. Includes HairSalon structured data and page tracking.
 */
export default function PeluqueriaLandingPage() {
  useEffect(() => {
    applyTheme('mediterraneo')
  }, [])

  usePageTracking('demo-peluqueria')

  return (
    <>
      <SharedSeo
        title="Peluquería Brisa Atlántica | Los Cristianos, Tenerife"
        description={SEO_DESCRIPTION}
        canonicalUrl={SITE_URL}
      />
      <SharedJsonLd schema={HAIR_SALON_SCHEMA} />

      <header className={styles.header}>
        <span className={styles.brand}>{BUSINESS.name}</span>
      </header>

      <main>
        <Hero
          title="Peluquería Brisa Atlántica"
          subtitle="Corte, color, mechas y tratamientos capilares en Los Cristianos, Tenerife"
          ctaLabel="Ver servicios"
          ctaHref="#servicios"
          backgroundImage="https://picsum.photos/seed/brisa-atlantica-hero/1600/900"
        />

        <section id="servicios" className={styles.sectionAlt} aria-label="Servicios de peluquería">
          <ServicesList services={SERVICES} heading="Nuestros servicios" />
        </section>

        <Reveal>
          <section className={styles.formSection} aria-labelledby="cita-heading">
            <h2 id="cita-heading" className={styles.formHeading}>
              Pide tu cita
            </h2>
            <AppointmentForm tenantId={PELUQUERIA_TENANT_ID} services={APPOINTMENT_SERVICES} />
          </section>
        </Reveal>

        <BusinessInfo
          className={styles.sectionAlt}
          address={BUSINESS.address}
          phone={BUSINESS.phone}
          email={BUSINESS.email}
          hours={HOURS}
          mapImageUrl="https://picsum.photos/seed/mapa-brisa/1200/450"
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
