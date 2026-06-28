import { Link } from 'react-router'
import styles from './construccionPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_BASE_PATH } from '../construccion/construccionShared'

/** Home page of the multi-page construction site: hero + featured services. */
export default function ConstruccionHomePage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  const featured =
    servicesState.status === 'success' ? toServices(servicesState.data).slice(0, 3) : []

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Construcción y reformas`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}`}
      />

      <Hero
        title={config.businessName}
        subtitle={config.businessDescription ?? ''}
        ctaLabel="Solicitar presupuesto"
        ctaHref={`${CONSTRUCCION_BASE_PATH}/contacto`}
        logoUrl={config.logoUrl}
      />

      {featured.length > 0 && (
        <section aria-label="Servicios destacados">
          <ServicesList services={featured} heading="Lo que hacemos" />
          <div className={styles.ctaWrap}>
            <Link to={`${CONSTRUCCION_BASE_PATH}/servicios`} className={styles.cta}>
              Ver todos los servicios
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
