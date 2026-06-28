import styles from './mecanicoPages.module.css'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { MECANICO_BASE_PATH } from '../mecanico-landing/mecanicoShared'

/** Full services catalogue page of the multi-page mechanic site. */
export default function MecanicoServiciosPage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`Servicios | ${config.businessName}`}
        description={`Servicios de mantenimiento y reparación de ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${MECANICO_BASE_PATH}/servicios`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Servicios</h1>
        <p className={styles.intro}>
          Revisamos, reparamos y mantenemos tu vehículo con componentes de primera calidad y
          garantía de mano de obra. Presupuesto sin compromiso.
        </p>
      </div>

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
        <ServicesList
          services={toServices(servicesState.data)}
          heading="Todos nuestros servicios"
        />
      )}
    </>
  )
}
