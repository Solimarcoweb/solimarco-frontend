import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './ConstruccionPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { LanguageSelector } from '../../../shared/components/LanguageSelector'
import { ServicesList } from '../../../shared/components/ServicesList'
import { ProjectGallery } from '../../../shared/components/ProjectGallery'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { Reveal } from '../../../shared/components/Reveal'
import { BudgetForm } from '../../../modules/reservations/components/BudgetForm'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { SUPPORTED_LOCALES } from '../../../i18n'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { useProjects } from '../../../core/tenant/useProjects'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { toBusinessHours, toProjects, toServices } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_THEME, LEGAL_LINKS, buildBusinessSchema } from './construccionShared'

/**
 * Single-page (landing) construction template, driven entirely by tenant data:
 * branding/contact/modules from `useTenantConfig`, and services / projects /
 * hours from their dedicated endpoints. Sections: Hero → Servicios → Proyectos
 * → Horario+Contacto → Presupuesto. Renders a loading/error state until the
 * content endpoints resolve.
 */
export default function ConstruccionLandingPage() {
  const { t, i18n } = useTranslation()
  const config = useTenantConfig()
  const servicesState = useServices()
  const projectsState = useProjects()
  const hoursState = useBusinessHours()

  useEffect(() => {
    applyTheme(config.themeName || CONSTRUCCION_THEME)
  }, [config.themeName])

  usePageTracking(config.tenantId)

  if (
    servicesState.status !== 'success' ||
    projectsState.status !== 'success' ||
    hoursState.status !== 'success'
  ) {
    const failed =
      servicesState.status === 'error' ||
      projectsState.status === 'error' ||
      hoursState.status === 'error'
    return (
      <main className={styles.status}>
        {failed ? (
          <p role="alert">{t('construccion.loadError')}</p>
        ) : (
          <p role="status">{t('construccion.loading')}</p>
        )}
      </main>
    )
  }

  const services = toServices(servicesState.data)
  const projects = toProjects(projectsState.data)
  const hours = toBusinessHours(hoursState.data)
  const canonicalUrl = `${window.location.origin}/`

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Construcción y reformas`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={canonicalUrl}
      />
      <SharedJsonLd schema={buildBusinessSchema(config, canonicalUrl)} />

      <header className={styles.header}>
        <span className={styles.brand}>{config.businessName}</span>
        <LanguageSelector availableLocales={[...SUPPORTED_LOCALES]} currentLocale={i18n.language} />
      </header>

      <main>
        <Hero
          title={config.businessName}
          subtitle={config.businessDescription ?? ''}
          ctaLabel={t('construccion.ctaRequestQuote')}
          ctaHref="#presupuesto"
          logoUrl={config.logoUrl}
        />

        {services.length > 0 && <ServicesList className={styles.sectionAlt} services={services} />}

        {projects.length > 0 && <ProjectGallery items={projects} />}

        <BusinessInfo
          className={styles.sectionAlt}
          address={config.address ?? ''}
          phone={config.phone ?? ''}
          email={config.email ?? ''}
          hours={hours}
        />

        {config.modules?.hasBudgetForm !== false && (
          <Reveal>
            <section id="presupuesto" className={styles.budget} aria-labelledby="budget-heading">
              <h2 id="budget-heading" className={styles.budgetHeading}>
                {t('construccion.budgetHeading')}
              </h2>
              <BudgetForm tenantId={config.tenantId} />
            </section>
          </Reveal>
        )}
      </main>

      <Footer
        className={styles.sectionAlt}
        businessName={config.businessName}
        address={config.address ?? ''}
        phone={config.phone ?? ''}
        email={config.email ?? ''}
        legalLinks={LEGAL_LINKS}
      />
    </>
  )
}
