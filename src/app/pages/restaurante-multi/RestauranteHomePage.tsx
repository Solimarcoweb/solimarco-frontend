import { Link } from 'react-router'
import styles from './restaurantePages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { Menu } from '../../../shared/components/Menu'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { BASE_PATH, FEATURED, RESTAURANT_TENANT_ID, SEO_DESCRIPTION, SITE_URL } from './restauranteData'

/**
 * Home page of the multi-page restaurant site: hero, a few highlighted dishes
 * and a call to action towards the reservations page.
 */
export default function RestauranteHomePage() {
  usePageTracking(RESTAURANT_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Restaurante El Drago | Cocina canaria en el Puerto de la Cruz"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/`}
      />

      <Hero
        title="Restaurante El Drago"
        subtitle="Cocina canaria de mercado en el corazón del Puerto de la Cruz"
        ctaLabel="Ver los destacados"
        ctaHref="#destacados"
        backgroundImage="https://picsum.photos/seed/el-drago-hero/1600/900"
      />

      <section id="destacados" className={styles.featured} aria-label="Platos destacados">
        <Menu categories={[{ id: 'destacados', name: 'Nuestros destacados', items: FEATURED }]} />
        <div className={styles.ctaWrap}>
          <Link to={`${BASE_PATH}/reservas`} className={styles.cta}>
            Reservar mesa
          </Link>
        </div>
      </section>
    </>
  )
}
