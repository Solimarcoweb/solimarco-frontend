import { Link, useOutletContext } from 'react-router'
import styles from './tiendaPages.module.css'
import { Hero } from '../../../shared/components/Hero'
import { ProductCatalog } from '../../../modules/sales/components/ProductCatalog'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useProducts } from '../../../core/tenant/useProducts'
import { TIENDA_BASE_PATH } from '../tienda-landing/tiendaShared'
import type { TiendaOutletContext } from './TiendaLayout'

/** Home page of the multi-page tienda site: hero, featured products and a CTA. */
export default function TiendaHomePage() {
  const config = useTenantConfig()
  const productsState = useProducts()
  const { addToCart } = useOutletContext<TiendaOutletContext>()
  usePageTracking(config.tenantId)

  const featured = productsState.status === 'success' ? productsState.data.slice(0, 4) : []

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Tienda`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={`${window.location.origin}${TIENDA_BASE_PATH}`}
      />

      <Hero
        title={config.businessName}
        subtitle={config.businessDescription ?? ''}
        ctaLabel="Ir a la tienda"
        ctaHref={`${TIENDA_BASE_PATH}/productos`}
        logoUrl={config.logoUrl}
      />

      {featured.length > 0 && (
        <section className={styles.highlights} aria-label="Productos destacados">
          <ProductCatalog products={featured} onAddToCart={addToCart} />
          <div className={styles.ctaWrap}>
            <Link to={`${TIENDA_BASE_PATH}/productos`} className={styles.cta}>
              Ver todo el catálogo
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
