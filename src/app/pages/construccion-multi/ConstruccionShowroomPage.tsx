import styles from './construccionPages.module.css'
import { ProductCatalog } from '../../../modules/sales/components/ProductCatalog'
import { Cart } from '../../../modules/sales/components/Cart'
import { useCart } from '../../../modules/sales/shared/useCart'
import { getProducts } from '../../../modules/sales/services/salesService'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useTenantResource } from '../../../core/tenant/useTenantResource'
import { CONSTRUCCION_BASE_PATH } from '../construccion/construccionShared'

/**
 * Showroom page of the multi-page construction site (materials shop). Only
 * available when the tenant has the shop module enabled; otherwise it renders
 * a "not available" notice.
 */
export default function ConstruccionShowroomPage() {
  const config = useTenantConfig()
  const { items, addToCart, updateQuantity, removeItem } = useCart()
  const productsState = useTenantResource('shop-products', getProducts)
  usePageTracking(config.tenantId)

  const seo = (
    <SharedSeo
      title={`Showroom | ${config.businessName}`}
      description={`Catálogo de materiales de ${config.businessName}.`}
      canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}/showroom`}
    />
  )

  if (!config.modules?.hasShop) {
    return (
      <>
        {seo}
        <p className={styles.status} role="status">
          El showroom no está disponible para este negocio.
        </p>
      </>
    )
  }

  return (
    <>
      {seo}

      <div className={styles.page}>
        <h1 className={styles.title}>Showroom</h1>
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
        <>
          <ProductCatalog products={productsState.data} onAddToCart={addToCart} />
          <Cart
            items={items}
            tenantId={config.tenantId}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        </>
      )}
    </>
  )
}
