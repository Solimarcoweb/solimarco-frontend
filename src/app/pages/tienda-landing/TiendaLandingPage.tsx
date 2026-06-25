import { useEffect } from 'react'
import styles from './TiendaLandingPage.module.css'
import { Hero } from '../../../shared/components/Hero'
import { BusinessInfo } from '../../../shared/components/BusinessInfo'
import { Footer } from '../../../shared/components/Footer'
import { SharedSeo, SharedJsonLd } from '../../../shared/seo'
import { ProductCatalog } from '../../../modules/sales/components/ProductCatalog'
import { Cart } from '../../../modules/sales/components/Cart'
import { useCart } from '../../../modules/sales/shared/useCart'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { applyTheme } from '../../../themes'
import {
  BUSINESS,
  HOURS,
  LEGAL_LINKS,
  PRODUCTS,
  SEO_DESCRIPTION,
  SITE_URL,
  STORE_SCHEMA,
  TIENDA_TENANT_ID,
} from '../tienda-multi/tiendaData'

/**
 * Landing page for the retail / local shop sector (El Rincón Canario).
 * Composes Hero → ProductCatalog → Cart → BusinessInfo → Footer
 * under the `fresco` theme. Includes Store structured data and page tracking.
 */
export default function TiendaLandingPage() {
  const { items, addToCart, updateQuantity, removeItem } = useCart()

  useEffect(() => {
    applyTheme('fresco')
  }, [])

  usePageTracking('demo-tienda')

  return (
    <>
      <SharedSeo
        title="El Rincón Canario | Tienda de productos canarios en Santa Cruz"
        description={SEO_DESCRIPTION}
        canonicalUrl={SITE_URL}
      />
      <SharedJsonLd schema={STORE_SCHEMA} />

      <header className={styles.header}>
        <span className={styles.brand}>{BUSINESS.name}</span>
      </header>

      <main>
        <Hero
          title="El Rincón Canario"
          subtitle="Mojos, gofio, quesos DOP, vinos de la tierra y artesanía canaria — todo en un solo lugar"
          ctaLabel="Ver productos"
          ctaHref="#tienda"
          backgroundImage="https://picsum.photos/seed/rincon-canario-hero/1600/900"
        />

        <section id="tienda" className={styles.sectionAlt} aria-label="Catálogo de productos">
          <ProductCatalog products={PRODUCTS} onAddToCart={addToCart} />
        </section>

        <section className={styles.cartSection} aria-label="Carrito de compra">
          <Cart
            items={items}
            tenantId={TIENDA_TENANT_ID}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        </section>

        <BusinessInfo
          className={styles.sectionAlt}
          address={BUSINESS.address}
          phone={BUSINESS.phone}
          email={BUSINESS.email}
          hours={HOURS}
          mapImageUrl="https://picsum.photos/seed/mapa-rincon/1200/450"
        />
      </main>

      <Footer
        businessName={BUSINESS.name}
        address={BUSINESS.address}
        phone={BUSINESS.phone}
        email={BUSINESS.email}
        legalLinks={LEGAL_LINKS}
      />
    </>
  )
}
