import styles from './genericoPages.module.css'
import { BudgetForm } from '../../../modules/reservations/components/BudgetForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { GENERICO_BASE_PATH } from '../generico-landing/genericoShared'

/** Budget request page of the multi-page generic site. */
export default function GenericoPresupuestoPage() {
  const config = useTenantConfig()
  usePageTracking(config.tenantId)

  const unavailable = config.modules?.hasBudgetForm === false

  return (
    <>
      <SharedSeo
        title={`Solicitar presupuesto | ${config.businessName}`}
        description={`Solicita un presupuesto sin compromiso para cualquiera de los servicios de ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${GENERICO_BASE_PATH}/presupuesto`}
      />

      <section className={styles.formSection}>
        <div className={styles.formInner}>
          <h1 className={styles.formTitle}>Solicitar presupuesto</h1>
          {unavailable ? (
            <p className={styles.status} role="status">
              La solicitud de presupuesto online no está disponible. Llámanos o escríbenos.
            </p>
          ) : (
            <>
              <p className={styles.formIntro}>
                Cuéntanos tu proyecto y te responderemos en menos de 24 horas con un presupuesto
                personalizado y sin compromiso.
              </p>
              <BudgetForm tenantId={config.tenantId} />
            </>
          )}
        </div>
      </section>
    </>
  )
}
