import styles from './tiendaPages.module.css'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { toBusinessHours } from '../../../core/tenant/tenantContentMappers'
import { TIENDA_BASE_PATH } from '../tienda-landing/tiendaShared'

/** Contact / location page of the multi-page tienda site. */
export default function TiendaContactoPage() {
  const config = useTenantConfig()
  const hoursState = useBusinessHours()
  usePageTracking(config.tenantId)

  const hours = hoursState.status === 'success' ? toBusinessHours(hoursState.data) : []

  return (
    <>
      <SharedSeo
        title={`Contacto | ${config.businessName}`}
        description={`Visítanos${config.address ? ` en ${config.address}` : ''} o llámanos${config.phone ? ` al ${config.phone}` : ''}.`}
        canonicalUrl={`${window.location.origin}${TIENDA_BASE_PATH}/contacto`}
      />

      <div className={styles.page}>
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
