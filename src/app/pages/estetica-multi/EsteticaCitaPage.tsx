import styles from './esteticaPages.module.css'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useTreatments } from '../../../core/tenant/useTreatments'
import { toAppointmentServices, toTreatments } from '../../../core/tenant/tenantContentMappers'
import { ESTETICA_BASE_PATH } from '../estetica-landing/esteticaShared'

/** Appointment request page of the multi-page estetica site. */
export default function EsteticaCitaPage() {
  const config = useTenantConfig()
  const treatmentsState = useTreatments()
  usePageTracking(config.tenantId)

  const unavailable = config.modules?.hasCitas === false

  return (
    <>
      <SharedSeo
        title={`Pedir cita | ${config.businessName}`}
        description={`Reserva tu tratamiento en ${config.businessName}. Te confirmamos la cita en menos de 24 horas.`}
        canonicalUrl={`${window.location.origin}${ESTETICA_BASE_PATH}/cita`}
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

            {treatmentsState.status === 'loading' && (
              <p className={styles.status} role="status">
                Cargando…
              </p>
            )}
            {treatmentsState.status === 'error' && (
              <p className={styles.status} role="alert">
                No se han podido cargar los tratamientos.
              </p>
            )}
            {treatmentsState.status === 'success' && (
              <div className={styles.formWrap}>
                <AppointmentForm
                  tenantId={config.tenantId}
                  services={toAppointmentServices(toTreatments(treatmentsState.data))}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
