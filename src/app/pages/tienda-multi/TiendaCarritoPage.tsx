import { useOutletContext } from 'react-router'
import styles from './tiendaPages.module.css'
import { Cart } from '../../../modules/sales/components/Cart'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { SITE_URL, TIENDA_TENANT_ID } from './tiendaData'
import type { TiendaOutletContext } from './TiendaLayout'

/** Cart and checkout page of the multi-page tienda site. */
export default function TiendaCarritoPage() {
  const { items, updateQuantity, removeItem } = useOutletContext<TiendaOutletContext>()

  usePageTracking(TIENDA_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Carrito | El Rincón Canario"
        description="Revisa tu selección y finaliza el pedido de productos canarios."
        canonicalUrl={`${SITE_URL}/carrito`}
      />

      <div className={styles.page}>
        <h1 className={styles.title}>Tu carrito</h1>
        <Cart
          items={items}
          tenantId={TIENDA_TENANT_ID}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
        />
      </div>
    </>
  )
}
