import styles from './restaurantePages.module.css'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { toBusinessHours } from '../../../core/tenant/tenantContentMappers'
import { RESTAURANTE_BASE_PATH } from '../restaurante-landing/restauranteShared'

/** Contact page of the multi-page restaurant site: hours and contact details. */
export default function RestauranteContactoPage() {
  const config = useTenantConfig()
  const hoursState = useBusinessHours()
  usePageTracking(config.tenantId)

  const hours = hoursState.status === 'success' ? toBusinessHours(hoursState.data) : []

  return (
    <>
      <SharedSeo
        title={`Contacto y horario | ${config.businessName}`}
        description={`Horario, dirección y contacto de ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${RESTAURANTE_BASE_PATH}/contacto`}
      />

      <div className={styles.pageHead}>
        <h1 className={styles.title}>Dónde estamos</h1>
      </div>

      <BusinessInfo
        address={config.address ?? ''}
        phone={config.phone ?? ''}
        email={config.email ?? ''}
        hours={hours}
      />
    </>
  )
}
