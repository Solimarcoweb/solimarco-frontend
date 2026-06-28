import styles from './genericoPages.module.css'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { GENERICO_BASE_PATH } from '../generico-landing/genericoShared'

/** Full services catalogue page of the multi-page generic site. */
export default function GenericoServiciosPage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`Servicios | ${config.businessName}`}
        description={`Servicios profesionales de ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${GENERICO_BASE_PATH}/servicios`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Nuestros servicios</h1>
        <p className={styles.intro}>
          Ofrecemos soluciones profesionales adaptadas a empresas y autónomos. Cada servicio incluye
          seguimiento personalizado y comunicación directa con el equipo responsable.
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
