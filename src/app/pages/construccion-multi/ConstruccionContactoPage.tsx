import { useTranslation } from 'react-i18next'
import ConstruccionPageHero from '../construccion/components/ConstruccionPageHero'
import ConstruccionContact from '../construccion/components/ConstruccionContact'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { toBusinessHours } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_BASE_PATH, CONSTRUCCION_PAGE_IMAGES } from '../construccion/construccionShared'

/** Contact page of the redesigned multi-page construccion site. */
export default function ConstruccionContactoPage() {
  const { t } = useTranslation()
  const config = useTenantConfig()
  const hoursState = useBusinessHours()
  usePageTracking(config.tenantId)

  const hours = hoursState.status === 'success' ? toBusinessHours(hoursState.data) : []

  return (
    <>
      <SharedSeo
        title={`${t('construccion.nav.contact')} | ${config.businessName}`}
        description={`${t('construccion.contactIntro')}`}
        canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}/contacto`}
      />

      <ConstruccionPageHero
        eyebrow={t('construccion.contactEyebrow')}
        title={t('construccion.contactHeading')}
        subtitle={t('construccion.contactIntro')}
        image={CONSTRUCCION_PAGE_IMAGES.contact}
      />

      <ConstruccionContact config={config} hours={hours} />
    </>
  )
}
