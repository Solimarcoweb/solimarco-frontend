import { useEffect } from 'react'
import styles from './TiendaLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { Reveal } from '../../../shared/components/Reveal'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { ProductCatalog } from '../../../modules/sales/components/ProductCatalog'
import { Cart } from '../../../modules/sales/components/Cart'
import { useCart } from '../../../modules/sales/shared/useCart'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { useProducts } from '../../../core/tenant/useProducts'
import { useBusinessHours } from '../../../core/tenant/useBusinessHours'
import { toBusinessHours } from '../../../core/tenant/tenantContentMappers'
import { TIENDA_THEME, LEGAL_LINKS, buildStoreSchema } from './tiendaShared'

/**
 * Single-page (landing) retail/shop template, driven by tenant data: branding/
 * contact from `useTenantConfig`, the catalog from `useProducts` and the hours
 * from `useBusinessHours`. Sections: Hero → Catálogo → Carrito (only when the
 * shop module is enabled) → Horario+Contacto → Footer. Renders a loading/error
 * state until the content endpoints resolve.
 */
export default function TiendaLandingPage() {
  const config = useTenantConfig()
  const productsState = useProducts()
  const hoursState = useBusinessHours()
  const { items, addToCart, updateQuantity, removeItem } = useCart()

  useEffect(() => {
    applyTheme(config.themeName || TIENDA_THEME)
  }, [config.themeName])

  usePageTracking(config.tenantId)

  if (productsState.status !== 'success' || hoursState.status !== 'success') {
    const failed = productsState.status === 'error' || hoursState.status === 'error'
    return (
      <main className={styles.status}>
        {failed ? (
          <p role="alert">No se ha podido cargar el contenido. Inténtalo de nuevo en unos minutos.</p>
        ) : (
          <p role="status">Cargando…</p>
        )}
      </main>
    )
  }

  const products = productsState.data
  const hours = toBusinessHours(hoursState.data)
  const hasShop = config.modules?.hasShop !== false
  const canonicalUrl = `${window.location.origin}/`

  return (
    <>
      <SharedSeo
        title={`${config.businessName} | Tienda`}
        description={config.businessDescription ?? config.businessName}
        canonicalUrl={canonicalUrl}
      />
      <SharedJsonLd schema={buildStoreSchema(config, canonicalUrl)} />

      <header className={styles.header}>
        <span className={styles.brand}>{config.businessName}</span>
      </header>

      <main>
        <Hero
          title={config.businessName}
          subtitle={config.businessDescription ?? ''}
          ctaLabel="Ver productos"
          ctaHref="#tienda"
          logoUrl={config.logoUrl}
        />

        {products.length > 0 && (
          <section id="tienda" className={styles.sectionAlt} aria-label="Catálogo de productos">
            <ProductCatalog products={products} onAddToCart={addToCart} />
          </section>
        )}

        {hasShop && (
          <Reveal>
            <section className={styles.cartSection} aria-label="Carrito de compra">
              <Cart
                items={items}
                tenantId={config.tenantId}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            </section>
          </Reveal>
        )}

        <BusinessInfo
          className={styles.sectionAlt}
          address={config.address ?? ''}
          phone={config.phone ?? ''}
          email={config.email ?? ''}
          hours={hours}
        />
      </main>

      <Footer
        businessName={config.businessName}
        address={config.address ?? ''}
        phone={config.phone ?? ''}
        email={config.email ?? ''}
        legalLinks={LEGAL_LINKS}
      />
    </>
  )
}
