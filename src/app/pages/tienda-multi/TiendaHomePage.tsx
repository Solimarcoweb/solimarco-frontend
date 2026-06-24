import { Link, useOutletContext } from 'react-router'
import styles from './tiendaPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ProductCatalog } from '../../../modules/sales/components/ProductCatalog'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { BASE_PATH, FEATURED_PRODUCTS, SEO_DESCRIPTION, SITE_URL, TIENDA_TENANT_ID } from './tiendaData'
import type { TiendaOutletContext } from './TiendaLayout'

/** Home page of the multi-page tienda site: hero, featured products and a CTA. */
export default function TiendaHomePage() {
  const { addToCart } = useOutletContext<TiendaOutletContext>()

  usePageTracking(TIENDA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="El Rincón Canario | Tienda de productos canarios en Santa Cruz"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/`}
      />

      <Hero
        title="El Rincón Canario"
        subtitle="Los sabores de las Islas, a un paso de ti. Mojos, gofio, quesos DOP, vinos y artesanía local."
        ctaLabel="Ir a la tienda"
        ctaHref={`${BASE_PATH}/productos`}
        backgroundImage="https://picsum.photos/seed/rincon-canario-home/1600/900"
      />

      <section className={styles.highlights} aria-label="Productos destacados">
        <ProductCatalog products={FEATURED_PRODUCTS} onAddToCart={addToCart} />
        <div className={styles.ctaWrap}>
          <Link to={`${BASE_PATH}/productos`} className={styles.cta}>
            Ver todo el catálogo
          </Link>
        </div>
      </section>
    </>
  )
}
