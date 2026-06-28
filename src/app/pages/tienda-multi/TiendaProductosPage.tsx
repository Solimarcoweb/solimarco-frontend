import { useOutletContext } from 'react-router'
import styles from './tiendaPages.module.css'
import { ProductCatalog } from '../../../modules/sales/components/ProductCatalog'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useProducts } from '../../../core/tenant/useProducts'
import { TIENDA_BASE_PATH } from '../tienda-landing/tiendaShared'
import type { TiendaOutletContext } from './TiendaLayout'

/** Full product catalogue page of the multi-page tienda site. */
export default function TiendaProductosPage() {
  const config = useTenantConfig()
  const productsState = useProducts()
  const { addToCart } = useOutletContext<TiendaOutletContext>()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`Tienda | ${config.businessName}`}
        description={`Catálogo de productos de ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${TIENDA_BASE_PATH}/productos`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Nuestra tienda</h1>
      </div>

      {productsState.status === 'loading' && (
        <p className={styles.status} role="status">
          Cargando…
        </p>
      )}
      {productsState.status === 'error' && (
        <p className={styles.status} role="alert">
          No se ha podido cargar el catálogo.
        </p>
      )}
      {productsState.status === 'success' && (
        <ProductCatalog products={productsState.data} onAddToCart={addToCart} />
      )}
    </>
  )
}
