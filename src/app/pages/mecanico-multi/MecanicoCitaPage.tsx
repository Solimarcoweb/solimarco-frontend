import styles from './mecanicoPages.module.css'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { MECANICO_BASE_PATH } from '../mecanico-landing/mecanicoShared'

/** Appointment request page of the multi-page mechanic site. */
export default function MecanicoCitaPage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  const unavailable = config.modules?.hasCitas === false

  return (
    <>
      <SharedSeo
        title={`Cita previa | ${config.businessName}`}
        description={`Solicita tu cita en ${config.businessName}. Te confirmamos la hora en menos de 24 horas.`}
        canonicalUrl={`${window.location.origin}${MECANICO_BASE_PATH}/cita`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Cita Previa</h1>

        {unavailable ? (
          <p className={styles.status} role="status">
            Las citas online no están disponibles. Llámanos para reservar.
          </p>
        ) : (
          <>
            <p className={styles.intro}>
              Rellena el formulario y te confirmaremos la cita por teléfono o email en menos de 24
              horas. Sin esperas, sin sorpresas.
            </p>

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
              <div className={styles.formWrap}>
                <AppointmentForm
                  tenantId={config.tenantId}
                  services={toServices(servicesState.data)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
