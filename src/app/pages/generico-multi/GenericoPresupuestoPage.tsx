import styles from './genericoPages.module.css'
import { BudgetForm } from '../../../modules/reservations/components/BudgetForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { GENERICO_TENANT_ID, SITE_URL } from './genericoData'

/** Budget request page of the multi-page generic site. */
export default function GenericoPresupuestoPage() {
  usePageTracking(GENERICO_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Solicitar presupuesto | Servicios Profesionales Tenerife"
        description="Solicita un presupuesto sin compromiso para cualquiera de nuestros servicios profesionales en Tenerife."
        canonicalUrl={`${SITE_URL}/presupuesto`}
      />

      <section className={styles.formSection}>
        <div className={styles.formInner}>
          <h1 className={styles.formTitle}>Solicitar presupuesto</h1>
          <p className={styles.formIntro}>
            Cuéntanos tu proyecto y te responderemos en menos de 24 horas con un presupuesto
            personalizado y sin compromiso.
          </p>
          <BudgetForm />
        </div>
      </section>
    </>
  )
}
