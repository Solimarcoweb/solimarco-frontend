import { useTranslation } from 'react-i18next'
import styles from './construccionPages.module.css'
import ConstruccionPageHero from '../construccion/components/ConstruccionPageHero'
import ConstruccionServices from '../construccion/components/ConstruccionServices'
import ConstruccionTestimonials from '../construccion/components/ConstruccionTestimonials'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_BASE_PATH, CONSTRUCCION_PAGE_IMAGES } from '../construccion/construccionShared'

/** Services page of the redesigned multi-page construccion site. */
export default function ConstruccionServiciosPage() {
  const { t } = useTranslation()
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`${t('construccion.nav.services')} | ${config.businessName}`}
        description={`${t('construccion.servicesIntro')}`}
        canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}/servicios`}
      />

      <ConstruccionPageHero
        eyebrow={t('construccion.servicesFeatured')}
        title={t('construccion.servicesHeading')}
        subtitle={t('construccion.servicesIntro')}
        image={CONSTRUCCION_PAGE_IMAGES.services}
      />

      {servicesState.status === 'loading' && (
        <p className={styles.status} role="status">
          {t('construccion.loading')}
        </p>
      )}
      {servicesState.status === 'error' && (
        <p className={styles.status} role="alert">
          {t('construccion.servicesError')}
        </p>
      )}
      {servicesState.status === 'success' && (
        <ConstruccionServices services={toServices(servicesState.data)} showHead={false} />
      )}

      <ConstruccionTestimonials />
    </>
  )
}
