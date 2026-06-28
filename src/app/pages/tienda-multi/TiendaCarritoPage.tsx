import { useOutletContext } from 'react-router'
import styles from './tiendaPages.module.css'
import { Cart } from '../../../modules/sales/components/Cart'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { TIENDA_BASE_PATH } from '../tienda-landing/tiendaShared'
import type { TiendaOutletContext } from './TiendaLayout'

/** Cart and checkout page of the multi-page tienda site. */
export default function TiendaCarritoPage() {
  const config = useTenantConfig()
  const { items, updateQuantity, removeItem } = useOutletContext<TiendaOutletContext>()
  usePageTracking(config.tenantId)

  return (
    <>
      <SharedSeo
        title={`Carrito | ${config.businessName}`}
        description={`Revisa tu selección y finaliza el pedido en ${config.businessName}.`}
        canonicalUrl={`${window.location.origin}${TIENDA_BASE_PATH}/carrito`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Tu carrito</h1>

        {config.modules?.hasShop === false ? (
          <p className={styles.status} role="status">
            La compra online no está disponible para este negocio.
          </p>
        ) : (
          <Cart
            items={items}
            tenantId={config.tenantId}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        )}
      </div>
    </>
  )
}
