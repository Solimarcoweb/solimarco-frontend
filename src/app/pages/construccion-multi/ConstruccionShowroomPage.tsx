import { useTranslation } from 'react-i18next'
import styles from './construccionPages.module.css'
import ConstruccionPageHero from '../construccion/components/ConstruccionPageHero'
import ConstruccionMaterials from '../construccion/components/ConstruccionMaterials'
import ConstruccionCta from '../construccion/components/ConstruccionCta'
import { ProductCatalog } from '../../../modules/sales/components/ProductCatalog'
import { Cart } from '../../../modules/sales/components/Cart'
import { useCart } from '../../../modules/sales/shared/useCart'
import { getProducts } from '../../../modules/sales/services/salesService'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useTenantResource } from '../../../core/tenant/useTenantResource'
import { CONSTRUCCION_BASE_PATH, CONSTRUCCION_PAGE_IMAGES } from '../construccion/construccionShared'

/**
 * Showroom page of the redesigned multi-page construccion site. When the tenant
 * has the shop module enabled it renders the materials catalog + cart (the
 * shared sales components, re-themed to the sector's dark/gold palette via the
 * `.shop` wrapper's CSS vars). Otherwise it falls back to the sample materials
 * brand grid.
 */
export default function ConstruccionShowroomPage() {
  const { t } = useTranslation()
  const config = useTenantConfig()
  const { items, addToCart, updateQuantity, removeItem } = useCart()
  const productsState = useTenantResource('shop-products', getProducts)
  usePageTracking(config.tenantId)

  const hasShop = config.modules?.hasShop === true

  return (
    <>
      <SharedSeo
        title={`${t('construccion.nav.showroom')} | ${config.businessName}`}
        description={`${t('construccion.showroomIntro')}`}
        canonicalUrl={`${window.location.origin}${CONSTRUCCION_BASE_PATH}/showroom`}
      />

      <ConstruccionPageHero
        eyebrow={t('construccion.materialsEyebrow')}
        title={t('construccion.showroomHeading')}
        subtitle={t('construccion.showroomIntro')}
        image={CONSTRUCCION_PAGE_IMAGES.showroom}
      />

      {hasShop ? (
        <div className={styles.shop}>
          {productsState.status === 'loading' && (
            <p className={styles.status} role="status">
              {t('construccion.loading')}
            </p>
          )}
          {productsState.status === 'error' && (
            <p className={styles.status} role="alert">
              {t('construccion.showroomError')}
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
        </div>
      ) : (
        <ConstruccionMaterials showHead={false} />
      )}

      <ConstruccionCta to="contacto" />
    </>
  )
}
