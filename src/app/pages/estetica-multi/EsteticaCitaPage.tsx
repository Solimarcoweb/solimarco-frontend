import styles from './esteticaPages.module.css'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { APPOINTMENT_SERVICES, ESTETICA_TENANT_ID, SITE_URL } from './esteticaData'

/** Appointment request page of the multi-page estetica site. */
export default function EsteticaCitaPage() {
  usePageTracking(ESTETICA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Pedir Cita | Centro Estético Magnolia"
        description="Reserva tu tratamiento en el Centro Estético Magnolia de Puerto de la Cruz. Te confirmamos la cita en menos de 24 horas."
        canonicalUrl={`${SITE_URL}/cita`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Pedir cita</h1>
        <p className={styles.intro}>
          Rellena el formulario y te confirmaremos la cita por teléfono o email en menos de 24 horas.
        </p>
        <div className={styles.formWrap}>
          <AppointmentForm tenantId={ESTETICA_TENANT_ID} services={APPOINTMENT_SERVICES} />
        </div>
      </div>
    </>
  )
}
