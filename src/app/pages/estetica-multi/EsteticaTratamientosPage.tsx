import styles from './esteticaPages.module.css'
import { TreatmentsList } from '../../../shared/components/TreatmentsList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { ESTETICA_TENANT_ID, SEO_DESCRIPTION, SITE_URL, TREATMENTS } from './esteticaData'

/** Full treatments catalogue page of the multi-page estetica site. */
export default function EsteticaTratamientosPage() {
  usePageTracking(ESTETICA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Tratamientos | Centro Estético Magnolia"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/tratamientos`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Tratamientos</h1>
        <p className={styles.intro}>
          Cada tratamiento está diseñado para adaptarse a tu piel y a tus objetivos. Nuestro equipo
          te asesorará en tu primera visita para recomendarte el protocolo más adecuado.
        </p>
      </div>

      <TreatmentsList treatments={TREATMENTS} heading="Todos los tratamientos" />
    </>
  )
}
