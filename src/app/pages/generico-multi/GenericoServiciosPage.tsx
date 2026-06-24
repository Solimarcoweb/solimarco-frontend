import styles from './genericoPages.module.css'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { GENERICO_TENANT_ID, SEO_DESCRIPTION, SERVICES, SITE_URL } from './genericoData'

/** Full services page of the multi-page generic site. */
export default function GenericoServiciosPage() {
  usePageTracking(GENERICO_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Servicios | Servicios Profesionales Tenerife"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/servicios`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Nuestros servicios</h1>
        <p className={styles.intro}>
          Ofrecemos soluciones profesionales adaptadas a empresas y autónomos de Tenerife.
          Cada servicio incluye seguimiento personalizado y comunicación directa con el equipo
          responsable.
        </p>
      </div>

      <ServicesList services={SERVICES} heading="Todos nuestros servicios" />
    </>
  )
}
