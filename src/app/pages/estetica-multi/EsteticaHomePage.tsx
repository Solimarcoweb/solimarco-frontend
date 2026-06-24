import { Link } from 'react-router'
import styles from './esteticaPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { TreatmentsList } from '../../../shared/components/TreatmentsList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import {
  BASE_PATH,
  ESTETICA_TENANT_ID,
  FEATURED_TREATMENTS,
  SEO_DESCRIPTION,
  SITE_URL,
} from './esteticaData'

/** Home page of the multi-page estetica site: hero, featured treatments and a CTA. */
export default function EsteticaHomePage() {
  usePageTracking(ESTETICA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Centro Estético Magnolia | Puerto de la Cruz, Tenerife"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/`}
      />

      <Hero
        title="Centro Estético Magnolia"
        subtitle="Cuídate con tratamientos de autor en un espacio tranquilo, en el corazón de Puerto de la Cruz"
        ctaLabel="Ver tratamientos"
        ctaHref={`${BASE_PATH}/tratamientos`}
        backgroundImage="https://picsum.photos/seed/magnolia-home/1600/900"
      />

      <section className={styles.highlights} aria-label="Tratamientos destacados">
        <TreatmentsList treatments={FEATURED_TREATMENTS} heading="Tratamientos destacados" />
        <div className={styles.ctaWrap}>
          <Link to={`${BASE_PATH}/cita`} className={styles.cta}>
            Pedir cita previa →
          </Link>
        </div>
      </section>
    </>
  )
}
