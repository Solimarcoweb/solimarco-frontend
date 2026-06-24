import styles from './peluqueriaPages.module.css'
import { AppointmentForm } from '../../../shared/components/AppointmentForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { APPOINTMENT_SERVICES, PELUQUERIA_TENANT_ID, SITE_URL } from './peluqueriaData'

/** Appointment request page of the multi-page peluqueria site. */
export default function PeluqueriaCitaPage() {
  usePageTracking(PELUQUERIA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Pedir Cita | Peluquería Brisa Atlántica"
        description="Reserva tu cita en la Peluquería Brisa Atlántica de Los Cristianos. Te confirmamos en menos de 24 horas."
        canonicalUrl={`${SITE_URL}/cita`}
      />

      <div className={styles.formSection}>
        <div className={styles.formWrap}>
          <h1 className={styles.formTitle}>Pedir cita</h1>
          <AppointmentForm tenantId={PELUQUERIA_TENANT_ID} services={APPOINTMENT_SERVICES} />
        </div>
      </div>
    </>
  )
}
