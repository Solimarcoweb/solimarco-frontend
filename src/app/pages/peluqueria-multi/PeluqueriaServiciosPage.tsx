import styles from './peluqueriaPages.module.css'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { PELUQUERIA_TENANT_ID, SEO_DESCRIPTION, SERVICES, SITE_URL } from './peluqueriaData'

/** Full services page of the multi-page peluqueria site. */
export default function PeluqueriaServiciosPage() {
  usePageTracking(PELUQUERIA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Servicios | Peluquería Brisa Atlántica"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/servicios`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Servicios</h1>
        <p className={styles.intro}>
          Desde el corte del día a día hasta el peinado para tu gran ocasión. Utilizamos productos
          sin parabenos y ofrecemos alternativas sin amoníaco para todos los tratamientos de color.
        </p>
      </div>

      <ServicesList services={SERVICES} heading="Todos nuestros servicios" />
    </>
  )
}
