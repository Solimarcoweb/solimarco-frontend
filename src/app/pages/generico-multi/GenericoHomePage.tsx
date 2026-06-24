import { Link } from 'react-router'
import styles from './genericoPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ServicesList } from '../../../shared/components/ServicesList'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import {
  BASE_PATH,
  FEATURED_SERVICES,
  GENERICO_TENANT_ID,
  SEO_DESCRIPTION,
  SITE_URL,
} from './genericoData'

/** Home page of the multi-page generic site: hero, featured services and a CTA. */
export default function GenericoHomePage() {
  usePageTracking(GENERICO_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Servicios Profesionales Tenerife | Santa Cruz"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/`}
      />

      <Hero
        title="Servicios Profesionales Tenerife"
        subtitle="Asesoramiento, gestión y tramitaciones para empresas y particulares en Tenerife. Soluciones a medida, sin burocracia innecesaria."
        ctaLabel="Ver servicios"
        ctaHref={`${BASE_PATH}/servicios`}
        backgroundImage="https://picsum.photos/seed/servicios-tenerife-home/1600/900"
      />

      <section className={styles.highlights} aria-label="Servicios destacados">
        <ServicesList services={FEATURED_SERVICES} heading="Lo que hacemos" />
        <div className={styles.ctaWrap}>
          <Link to={`${BASE_PATH}/presupuesto`} className={styles.cta}>
            Solicitar presupuesto
          </Link>
        </div>
      </section>
    </>
  )
}
