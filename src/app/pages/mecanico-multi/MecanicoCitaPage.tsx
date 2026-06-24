import styles from './mecanicoPages.module.css'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { MECANICO_TENANT_ID, SERVICES, SITE_URL } from './mecanicoData'

/** Appointment request page of the multi-page mechanic site. */
export default function MecanicoCitaPage() {
  usePageTracking(MECANICO_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Cita Previa | Taller Mecánico El Teide"
        description="Solicita tu cita en el Taller Mecánico El Teide. Rellena el formulario y te confirmamos la hora en menos de 24 h."
        canonicalUrl={`${SITE_URL}/cita`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Cita Previa</h1>
        <p className={styles.intro}>
          Rellena el formulario y te confirmaremos la cita por teléfono o email en menos de 24 horas.
          Sin esperas, sin sorpresas.
        </p>
        <div className={styles.formWrap}>
          <AppointmentForm tenantId={MECANICO_TENANT_ID} services={SERVICES} />
        </div>
      </div>
    </>
  )
}
