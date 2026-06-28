import { useEffect } from 'react'
import styles from './GenericoLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { Reveal } from '../../../shared/components/Reveal'
import { ServicesList } from '../../../shared/components/ServicesList'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { BudgetForm } from '../../../modules/reservations/components/BudgetForm'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { toBusinessHours, toServices } from '../../../core/tenant/tenantContentMappers'
import { GENERICO_THEME, LEGAL_LINKS, buildLocalBusinessSchema } from './genericoShared'

/**
 * Single-page (landing) generic / configurable business template, driven by
 * tenant data: branding/contact/modules from `useTenantConfig`, services from
 * `useServices` and hours from `useBusinessHours`.
 * Sections: Hero → Servicios → Presupuesto → Horario+Contacto → Footer. Renders
 * a loading/error state until the content endpoints resolve.
 */
export default function GenericoLandingPage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  const hoursState = useBusinessHours()

  useEffect(() => {
    applyTheme(config.themeName || GENERICO_THEME)
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
  const canRequestBudget = config.modules?.hasBudgetForm !== false
  const canonicalUrl = `${window.location.origin}/`

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Servicios profesionales`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={canonicalUrl}
      />
      <SharedJsonLd schema={buildLocalBusinessSchema(config, canonicalUrl)} />

      <header className={styles.header}>
        <span className={styles.brand}>{config.businessName}</span>
      </header>

      <main>
        <Hero
          title={config.businessName}
          subtitle={config.businessDescription ?? ''}
          ctaLabel="Ver servicios"
          ctaHref="#servicios"
          logoUrl={config.logoUrl}
        />

        {services.length > 0 && (
          <section id="servicios" className={styles.sectionAlt} aria-label="Servicios profesionales">
            <ServicesList services={services} heading="Nuestros servicios" />
          </section>
        )}

        {canRequestBudget && (
          <Reveal>
            <section id="presupuesto" className={styles.formSection} aria-labelledby="presupuesto-heading">
              <div className={styles.formInner}>
                <h2 id="presupuesto-heading" className={styles.formHeading}>
                  Solicitar presupuesto
                </h2>
                <p className={styles.formIntro}>
                  Sin compromiso. Te respondemos en menos de 24 horas laborables.
                </p>
                <BudgetForm tenantId={config.tenantId} />
              </div>
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
