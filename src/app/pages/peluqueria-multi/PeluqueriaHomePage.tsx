import { Link } from 'react-router'
import styles from './peluqueriaPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { PELUQUERIA_BASE_PATH } from '../peluqueria-landing/peluqueriaShared'

/** Home page of the multi-page peluqueria site: hero, featured services and a CTA. */
export default function PeluqueriaHomePage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  const featured =
    servicesState.status === 'success' ? toServices(servicesState.data).slice(0, 3) : []

  const canBook = config.modules?.hasCitas !== false

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Peluquería`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={`${window.location.origin}${PELUQUERIA_BASE_PATH}`}
      />

      <Hero
        title={config.businessName}
        subtitle={config.businessDescription ?? ''}
        ctaLabel="Ver servicios"
        ctaHref={`${PELUQUERIA_BASE_PATH}/servicios`}
        logoUrl={config.logoUrl}
      />

      {featured.length > 0 && (
        <section className={styles.highlights} aria-label="Servicios destacados">
          <ServicesList services={featured} heading="Lo que hacemos" />
          {canBook && (
            <div className={styles.ctaWrap}>
              <Link to={`${PELUQUERIA_BASE_PATH}/cita`} className={styles.cta}>
                Pedir cita
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  )
}
