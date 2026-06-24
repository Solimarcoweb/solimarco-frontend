import { useOutletContext } from 'react-router'
import styles from './tiendaPages.module.css'
import { ProductCatalog } from '../../../modules/sales/components/ProductCatalog'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { PRODUCTS, SEO_DESCRIPTION, SITE_URL, TIENDA_TENANT_ID } from './tiendaData'
import type { TiendaOutletContext } from './TiendaLayout'

/** Full product catalogue page of the multi-page tienda site. */
export default function TiendaProductosPage() {
  const { addToCart } = useOutletContext<TiendaOutletContext>()

  usePageTracking(TIENDA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Tienda | El Rincón Canario"
        description={SEO_DESCRIPTION}
        canonicalUrl={`${SITE_URL}/productos`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Nuestra tienda</h1>
        <p className={styles.intro}>
          Selección de productos típicos canarios: mojos artesanos, gofio de molino, quesos con
          denominación de origen, vinos de la tierra y artesanía elaborada a mano en las Islas.
        </p>
      </div>

      <ProductCatalog products={PRODUCTS} onAddToCart={addToCart} />
    </>
  )
}
