import { Link } from 'react-router'
import styles from './peluqueriaPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import {
  BASE_PATH,
  FEATURED_SERVICES,
  PELUQUERIA_TENANT_ID,
  SEO_DESCRIPTION,
  SITE_URL,
} from './peluqueriaData'

/** Home page of the multi-page peluqueria site: hero, featured services and a CTA. */
export default function PeluqueriaHomePage() {
  usePageTracking(PELUQUERIA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Peluquería Brisa Atlántica | Los Cristianos, Tenerife"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/`}
      />

      <Hero
        title="Peluquería Brisa Atlántica"
        subtitle="Tu peluquería de confianza en Los Cristianos, Tenerife. Corte, color y tratamientos con alma."
        ctaLabel="Ver servicios"
        ctaHref={`${BASE_PATH}/servicios`}
        backgroundImage="https://picsum.photos/seed/brisa-atlantica-home/1600/900"
      />

      <section className={styles.highlights} aria-label="Servicios destacados">
        <ServicesList services={FEATURED_SERVICES} heading="Lo que hacemos" />
        <div className={styles.ctaWrap}>
          <Link to={`${BASE_PATH}/cita`} className={styles.cta}>
            Pedir cita
          </Link>
        </div>
      </section>
    </>
  )
}
