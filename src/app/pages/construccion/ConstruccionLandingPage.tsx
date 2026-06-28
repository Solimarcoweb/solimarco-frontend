import { useEffect, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './ConstruccionPage.module.css'
import ConstruccionHeader from './components/ConstruccionHeader'
import ConstruccionHero from './components/ConstruccionHero'
import ConstruccionServices from './components/ConstruccionServices'
import ConstruccionProjects from './components/ConstruccionProjects'
import ConstruccionMaterials from './components/ConstruccionMaterials'
import ConstruccionTestimonials from './components/ConstruccionTestimonials'
import ConstruccionContact from './components/ConstruccionContact'
import ConstruccionCta from './components/ConstruccionCta'
import ConstruccionFooter from './components/ConstruccionFooter'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { useProjects } from '../../../core/tenant/useProjects'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { toBusinessHours, toProjects, toServices } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_THEME, buildBusinessSchema } from './construccionShared'

/**
 * Redesigned single-page (landing) construction template. Dark/gold sector look
 * built from sector-local components (no shared component edits). Data still
 * comes from the multi-tenant layer: branding/contact/modules from
 * `useTenantConfig`, and services / projects / hours from their endpoints.
 *
 * Sections: Header → Hero → Servicios → Proyectos → Showroom → Testimonios →
 * Contacto (+ BudgetForm) → CTA → Footer. Renders a loading/error state until
 * the content endpoints resolve.
 */
export default function ConstruccionLandingPage() {
  const { t } = useTranslation()
  const config = useTenantConfig()
  const servicesState = useServices()
  const projectsState = useProjects()
  const hoursState = useBusinessHours()

  // Keep the app theme baseline in sync (token fallback outside the landing).
  useEffect(() => {
    applyTheme(config.themeName || CONSTRUCCION_THEME)
  }, [config.themeName])

  // The sector owns a dark palette via local CSS vars on `.page` (they win by
  // cascade for everything inside). `applyTheme` paints `<html>` with the light
  // theme background, so repaint it dark here and enable smooth in-page scroll;
  // both are restored on unmount.
  useEffect(() => {
    const html = document.documentElement
    const prevBg = html.style.backgroundColor
    const prevScroll = html.style.scrollBehavior
    html.style.backgroundColor = '#0d0c09'
    html.style.scrollBehavior = 'smooth'
    return () => {
      html.style.backgroundColor = prevBg
      html.style.scrollBehavior = prevScroll
    }
  }, [])

  usePageTracking(config.tenantId)

  const accentStyle = config.primaryColor
    ? ({ '--accent': config.primaryColor } as CSSProperties)
    : undefined

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
      <div className={styles.page} style={accentStyle}>
        <main className={styles.status}>
          {failed ? (
            <p role="alert">{t('construccion.loadError')}</p>
          ) : (
            <p role="status">{t('construccion.loading')}</p>
          )}
        </main>
      </div>
    )
  }

  const services = toServices(servicesState.data)
  const projects = toProjects(projectsState.data)
  const hours = toBusinessHours(hoursState.data)
  const canonicalUrl = `${window.location.origin}/`

  return (
    <div className={styles.page} style={accentStyle}>
      <SharedSeo
        title={`${config.businessName} | Construcción y reformas`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={canonicalUrl}
      />
      <SharedJsonLd schema={buildBusinessSchema(config, canonicalUrl)} />

      <ConstruccionHeader businessName={config.businessName} />

      <main>
        <ConstruccionHero config={config} />
        <ConstruccionServices services={services} />
        <ConstruccionProjects projects={projects} />
        <ConstruccionMaterials />
        <ConstruccionTestimonials />
        <ConstruccionContact config={config} hours={hours} />
        <ConstruccionCta />
      </main>

      <ConstruccionFooter config={config} />
    </div>
  )
}
