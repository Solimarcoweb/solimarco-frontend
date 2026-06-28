import styles from './construccionPages.module.css'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { BudgetForm } from '../../../modules/reservations/components/BudgetForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { toBusinessHours } from '../../../core/tenant/tenantContentMappers'
import { CONSTRUCCION_BASE_PATH } from '../construccion/construccionShared'

/** Contact page of the multi-page construction site: location, hours + budget form. */
export default function ConstruccionContactoPage() {
  const config = useTenantConfig()
  const hoursState = useBusinessHours()
  usePageTracking(config.tenantId)

  const hours = hoursState.status === 'success' ? toBusinessHours(hoursState.data) : []

  return (
    <>
      <SharedSeo
        title={`Contacto | ${config.businessName}`}
        description={`Contacta con ${config.businessName}. Llámanos o solicita presupuesto sin compromiso.`}
        canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}/contacto`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Contacto</h1>
      </div>

      <BusinessInfo
        address={config.address ?? ''}
        phone={config.phone ?? ''}
        email={config.email ?? ''}
        hours={hours}
      />

      {config.modules?.hasBudgetForm !== false && (
        <section id="presupuesto" className={styles.budget} aria-labelledby="budget-heading">
          <h2 id="budget-heading" className={styles.budgetHeading}>
            Solicita tu presupuesto
          </h2>
          <BudgetForm tenantId={config.tenantId} />
        </section>
      )}
    </>
  )
}
