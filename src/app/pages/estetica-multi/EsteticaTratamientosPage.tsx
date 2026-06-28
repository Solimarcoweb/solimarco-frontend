import styles from './esteticaPages.module.css'
import { TreatmentsList } from '../../../shared/components/TreatmentsList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useTreatments } from '../../../core/tenant/useTreatments'
import { toTreatments } from '../../../core/tenant/tenantContentMappers'
import { ESTETICA_BASE_PATH } from '../estetica-landing/esteticaShared'

/** Full treatments catalogue page of the multi-page estetica site. */
export default function EsteticaTratamientosPage() {
  const config = useTenantConfig()
  const treatmentsState = useTreatments()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`Tratamientos | ${config.businessName}`}
        description={`Catálogo de tratamientos de ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${ESTETICA_BASE_PATH}/tratamientos`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Tratamientos</h1>
        <p className={styles.intro}>
          Cada tratamiento está diseñado para adaptarse a tu piel y a tus objetivos. Nuestro equipo
          te asesorará en tu primera visita para recomendarte el protocolo más adecuado.
        </p>
      </div>

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
        <TreatmentsList
          treatments={toTreatments(treatmentsState.data)}
          heading="Todos los tratamientos"
        />
      )}
    </>
  )
}
