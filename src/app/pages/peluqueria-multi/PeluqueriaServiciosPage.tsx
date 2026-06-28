import styles from './peluqueriaPages.module.css'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { PELUQUERIA_BASE_PATH } from '../peluqueria-landing/peluqueriaShared'

/** Full services catalogue page of the multi-page peluqueria site. */
export default function PeluqueriaServiciosPage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`Servicios | ${config.businessName}`}
        description={`Servicios de peluquería de ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${PELUQUERIA_BASE_PATH}/servicios`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Servicios</h1>
        <p className={styles.intro}>
          Desde el corte del día a día hasta el peinado para tu gran ocasión. Utilizamos productos
          sin parabenos y ofrecemos alternativas sin amoníaco para todos los tratamientos de color.
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
