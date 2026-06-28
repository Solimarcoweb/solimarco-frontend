import { useEffect } from 'react'
import styles from './MecanicoLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { Reveal } from '../../../shared/components/Reveal'
import { ServicesList } from '../../../shared/components/ServicesList'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { toBusinessHours, toServices } from '../../../core/tenant/tenantContentMappers'
import { MECANICO_THEME, LEGAL_LINKS, buildAutoRepairSchema } from './mecanicoShared'

/**
 * Single-page (landing) mechanic/workshop template, driven by tenant data:
 * branding/contact from `useTenantConfig`, services from `useServices` (also
 * feeding the appointment form) and hours from `useBusinessHours`.
 * Sections: Hero → Servicios → Cita → Horario+Contacto → Footer. Renders a
 * loading/error state until the content endpoints resolve.
 */
export default function MecanicoLandingPage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  const hoursState = useBusinessHours()

  useEffect(() => {
    applyTheme(config.themeName || MECANICO_THEME)
  }, [config.themeName])

  usePageTracking(config.tenantId)

  if (servicesState.status !== 'success' || hoursState.status !== 'success') {
    const failed = servicesState.status === 'error' || hoursState.status === 'error'
    return (
      <main className={styles.status}>
        {failed ? (
          <p role="alert">No se ha podido cargar el contenido. Inténtalo de nuevo en unos minutos.</p>
        ) : (
          <p role="status">Cargando…</p>
        )}
      </main>
    )
  }

  const services = toServices(servicesState.data)
  const hours = toBusinessHours(hoursState.data)
  const canBook = config.modules?.hasCitas !== false
  const canonicalUrl = `${window.location.origin}/`

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Taller mecánico`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={canonicalUrl}
      />
      <SharedJsonLd schema={buildAutoRepairSchema(config, canonicalUrl)} />

      <header className={styles.header}>
        <span className={styles.brand}>{config.businessName}</span>
      </header>

      <main>
        <Hero
          title={config.businessName}
          subtitle={config.businessDescription ?? ''}
          ctaLabel="Pedir cita"
          ctaHref="#cita"
          logoUrl={config.logoUrl}
        />

        {services.length > 0 && (
          <section id="servicios" className={styles.sectionAlt} aria-label="Nuestros servicios">
            <ServicesList services={services} />
          </section>
        )}

        {canBook && services.length > 0 && (
          <Reveal>
            <section id="cita" className={styles.formSection} aria-labelledby="cita-heading">
              <h2 id="cita-heading" className={styles.formHeading}>
                Pide tu cita
              </h2>
              <AppointmentForm tenantId={config.tenantId} services={services} />
            </section>
          </Reveal>
        )}

        <BusinessInfo
          className={styles.sectionAlt}
          address={config.address ?? ''}
          phone={config.phone ?? ''}
          email={config.email ?? ''}
          hours={hours}
        />
      </main>

      <Footer
        businessName={config.businessName}
        address={config.address ?? ''}
        phone={config.phone ?? ''}
        email={config.email ?? ''}
        legalLinks={LEGAL_LINKS}
      />
    </>
  )
}
