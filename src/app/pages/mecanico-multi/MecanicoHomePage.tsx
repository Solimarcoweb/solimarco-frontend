import { Link } from 'react-router'
import styles from './mecanicoPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { MECANICO_BASE_PATH } from '../mecanico-landing/mecanicoShared'

/**
 * Home page of the multi-page mechanic site: hero, featured services teaser
 * and a call to action towards the appointment page.
 */
export default function MecanicoHomePage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  const featured =
    servicesState.status === 'success' ? toServices(servicesState.data).slice(0, 3) : []

  const canBook = config.modules?.hasCitas !== false

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Taller mecánico`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={`${window.location.origin}${MECANICO_BASE_PATH}`}
      />

      <Hero
        title={config.businessName}
        subtitle={config.businessDescription ?? ''}
        ctaLabel="Pedir cita"
        ctaHref={canBook ? `${MECANICO_BASE_PATH}/cita` : `${MECANICO_BASE_PATH}/contacto`}
        logoUrl={config.logoUrl}
      />

      {featured.length > 0 && (
        <section id="servicios-destacados" className={styles.highlights} aria-label="Servicios destacados">
          <ServicesList services={featured} heading="Lo que hacemos" />
          {canBook && (
            <div className={styles.ctaWrap}>
              <Link to={`${MECANICO_BASE_PATH}/cita`} className={styles.cta}>
                Pedir cita previa
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  )
}
