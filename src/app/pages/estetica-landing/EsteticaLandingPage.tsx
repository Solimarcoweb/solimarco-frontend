import { useEffect } from 'react'
import styles from './EsteticaLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { Reveal } from '../../../shared/components/Reveal'
import { TreatmentsList } from '../../../shared/components/TreatmentsList'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useTreatments } from '../../../core/tenant/useTreatments'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import {
  toAppointmentServices,
  toBusinessHours,
  toTreatments,
} from '../../../core/tenant/tenantContentMappers'
import { ESTETICA_THEME, LEGAL_LINKS, buildBeautySalonSchema } from './esteticaShared'

/**
 * Single-page (landing) beauty/aesthetic template, driven by tenant data:
 * branding/contact from `useTenantConfig`, treatments from `useTreatments`
 * (also feeding the appointment form) and hours from `useBusinessHours`.
 * Sections: Hero → Tratamientos → Cita → Horario+Contacto → Footer. Renders a
 * loading/error state until the content endpoints resolve.
 */
export default function EsteticaLandingPage() {
  const config = useTenantConfig()
  const treatmentsState = useTreatments()
  const hoursState = useBusinessHours()

  useEffect(() => {
    applyTheme(config.themeName || ESTETICA_THEME)
  }, [config.themeName])

  usePageTracking(config.tenantId)

  if (treatmentsState.status !== 'success' || hoursState.status !== 'success') {
    const failed = treatmentsState.status === 'error' || hoursState.status === 'error'
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

  const treatments = toTreatments(treatmentsState.data)
  const hours = toBusinessHours(hoursState.data)
  const canBook = config.modules?.hasCitas !== false
  const canonicalUrl = `${window.location.origin}/`

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Centro estético`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={canonicalUrl}
      />
      <SharedJsonLd schema={buildBeautySalonSchema(config, canonicalUrl)} />

      <header className={styles.header}>
        <span className={styles.brand}>{config.businessName}</span>
      </header>

      <main>
        <Hero
          title={config.businessName}
          subtitle={config.businessDescription ?? ''}
          ctaLabel="Ver tratamientos"
          ctaHref="#tratamientos"
          logoUrl={config.logoUrl}
        />

        {treatments.length > 0 && (
          <section
            id="tratamientos"
            className={styles.sectionAlt}
            aria-label="Catálogo de tratamientos"
          >
            <TreatmentsList treatments={treatments} heading="Nuestros tratamientos" />
          </section>
        )}

        {canBook && treatments.length > 0 && (
          <Reveal>
            <section className={styles.formSection} aria-labelledby="cita-heading">
              <h2 id="cita-heading" className={styles.formHeading}>
                Pide tu cita
              </h2>
              <AppointmentForm
                tenantId={config.tenantId}
                services={toAppointmentServices(treatments)}
              />
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
