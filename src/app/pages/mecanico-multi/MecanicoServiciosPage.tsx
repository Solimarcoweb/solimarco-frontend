import styles from './mecanicoPages.module.css'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { MECANICO_TENANT_ID, SEO_DESCRIPTION, SERVICES, SITE_URL } from './mecanicoData'

/** Full services catalogue page of the multi-page mechanic site. */
export default function MecanicoServiciosPage() {
  usePageTracking(MECANICO_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Servicios | Taller Mecánico El Teide"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/servicios`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Servicios</h1>
        <p className={styles.intro}>
          Revisamos, reparamos y mantenemos tu vehículo con componentes de primera calidad y
          garantía de mano de obra. Presupuesto sin compromiso.
        </p>
      </div>

      <ServicesList services={SERVICES} heading="Todos nuestros servicios" />
    </>
  )
}
