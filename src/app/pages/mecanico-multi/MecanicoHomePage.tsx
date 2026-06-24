import { Link } from 'react-router'
import styles from './mecanicoPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import {
  BASE_PATH,
  FEATURED_SERVICES,
  MECANICO_TENANT_ID,
  SEO_DESCRIPTION,
  SITE_URL,
} from './mecanicoData'

/**
 * Home page of the multi-page mechanic site: hero, featured services teaser
 * and a call to action towards the appointment page.
 */
export default function MecanicoHomePage() {
  usePageTracking(MECANICO_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Taller Mecánico El Teide | Mecánica en La Laguna, Tenerife"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/`}
      />

      <Hero
        title="Taller Mecánico El Teide"
        subtitle="Mantenimiento, frenos, ITV y electricidad en San Cristóbal de La Laguna"
        ctaLabel="Pedir cita"
        ctaHref={`${BASE_PATH}/cita`}
        backgroundImage="https://picsum.photos/seed/taller-el-teide-home/1600/900"
      />

      <section id="servicios-destacados" className={styles.highlights} aria-label="Servicios destacados">
        <ServicesList services={FEATURED_SERVICES} heading="Lo que hacemos" />
        <div className={styles.ctaWrap}>
          <Link to={`${BASE_PATH}/cita`} className={styles.cta}>
            Pedir cita previa
          </Link>
        </div>
      </section>
    </>
  )
}
