import styles from './peluqueriaPages.module.css'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useServices } from '../../../core/tenant/useServices'
import { toServices } from '../../../core/tenant/tenantContentMappers'
import { PELUQUERIA_BASE_PATH } from '../peluqueria-landing/peluqueriaShared'

/** Appointment request page of the multi-page peluqueria site. */
export default function PeluqueriaCitaPage() {
  const config = useTenantConfig()
  const servicesState = useServices()
  usePageTracking(config.tenantId)

  const unavailable = config.modules?.hasCitas === false

  return (
    <>
      <SharedSeo
        title={`Pedir cita | ${config.businessName}`}
        description={`Reserva tu cita en ${config.businessName}. Te confirmamos en menos de 24 horas.`}
        canonicalUrl={`${window.location.origin}${PELUQUERIA_BASE_PATH}/cita`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Pedir cita</h1>

        {unavailable ? (
          <p className={styles.status} role="status">
            Las citas online no están disponibles. Llámanos para reservar.
          </p>
        ) : (
          <>
            <p className={styles.intro}>
              Rellena el formulario y te confirmaremos la cita por teléfono o email en menos de 24
              horas.
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
