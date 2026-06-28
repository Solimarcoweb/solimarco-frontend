import { Link } from 'react-router'
import styles from './genericoPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { GENERICO_BASE_PATH } from '../generico-landing/genericoShared'

/** Home page of the multi-page generic site: hero, featured services and a CTA. */
export default function GenericoHomePage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  const featured =
    servicesState.status === 'success' ? toServices(servicesState.data).slice(0, 3) : []

  const canRequestBudget = config.modules?.hasBudgetForm !== false

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Servicios profesionales`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={`${window.location.origin}${GENERICO_BASE_PATH}`}
      />

      <Hero
        title={config.businessName}
        subtitle={config.businessDescription ?? ''}
        ctaLabel="Ver servicios"
        ctaHref={`${GENERICO_BASE_PATH}/servicios`}
        logoUrl={config.logoUrl}
      />

      {featured.length > 0 && (
        <section className={styles.highlights} aria-label="Servicios destacados">
          <ServicesList services={featured} heading="Lo que hacemos" />
          {canRequestBudget && (
            <div className={styles.ctaWrap}>
              <Link to={`${GENERICO_BASE_PATH}/presupuesto`} className={styles.cta}>
                Solicitar presupuesto
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  )
}
