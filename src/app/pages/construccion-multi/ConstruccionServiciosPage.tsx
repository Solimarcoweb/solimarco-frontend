import styles from './construccionPages.module.css'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_BASE_PATH } from '../construccion/construccionShared'

/** Services page of the multi-page construction site. */
export default function ConstruccionServiciosPage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`Servicios | ${config.businessName}`}
        description={`Servicios de construcción y reforma de ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}/servicios`}
      />

      {servicesState.status === 'loading' && (
        <p className={styles.status} role="status">
          Cargando…
        </p>
      )}
      {servicesState.status === 'error' && (
        <p className={styles.status} role="alert">
          No se han podido cargar los servicios.
        </p>
      )}
      {servicesState.status === 'success' && (
        <ServicesList services={toServices(servicesState.data)} heading="Nuestros servicios" />
      )}
    </>
  )
}
