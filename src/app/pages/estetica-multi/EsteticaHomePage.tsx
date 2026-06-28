import { Link } from 'react-router'
import styles from './esteticaPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { TreatmentsList } from '../../../shared/components/TreatmentsList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useTreatments } from '../../../core/tenant/useTreatments'
import { toTreatments } from '../../../core/tenant/tenantContentMappers'
import { ESTETICA_BASE_PATH } from '../estetica-landing/esteticaShared'

/** Home page of the multi-page estetica site: hero, featured treatments and a CTA. */
export default function EsteticaHomePage() {
  const config = useTenantConfig()
  const treatmentsState = useTreatments()
  usePageTracking(config.tenantId)

  // Up to four treatments in display order, as a teaser.
  const featured =
    treatmentsState.status === 'success' ? toTreatments(treatmentsState.data).slice(0, 4) : []

  const canBook = config.modules?.hasCitas !== false

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Centro estético`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={`${window.location.origin}${ESTETICA_BASE_PATH}`}
      />

      <Hero
        title={config.businessName}
        subtitle={config.businessDescription ?? ''}
        ctaLabel="Ver tratamientos"
        ctaHref={`${ESTETICA_BASE_PATH}/tratamientos`}
        logoUrl={config.logoUrl}
      />

      {featured.length > 0 && (
        <section className={styles.highlights} aria-label="Tratamientos destacados">
          <TreatmentsList treatments={featured} heading="Tratamientos destacados" />
          {canBook && (
            <div className={styles.ctaWrap}>
              <Link to={`${ESTETICA_BASE_PATH}/cita`} className={styles.cta}>
                Pedir cita previa →
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  )
}
