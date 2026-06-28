import { useEffect } from 'react'
import { Link, Outlet, useMatch } from 'react-router'
import styles from './TiendaLayout.module.css'
import { Footer } from '../../../shared/components/Footer'
import { SharedJsonLd } from '../../../shared/seo'
import { useCart } from '../../../modules/sales/shared/useCart'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { TIENDA_BASE_PATH, TIENDA_THEME, LEGAL_LINKS, buildStoreSchema } from '../tienda-landing/tiendaShared'
import type { CartItem, ProductItem } from '../../../modules/sales/models/product'

/** Shape of the context passed to child pages via React Router's Outlet. */
export interface TiendaOutletContext {
  items: CartItem[]
  addToCart: (product: ProductItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
}

/** Nav link that marks itself with aria-current when it matches the route. */
function NavItem({ to, label }: { to: string; label: string }) {
  const isActive = useMatch(to) !== null
  const className = isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink

  return (
    <li>
      <Link to={to} className={className} aria-current={isActive ? 'page' : undefined}>
        {label}
      </Link>
    </li>
  )
}

/**
 * Shared layout for the multi-page tienda site. Owns the cart state and exposes
 * it to child pages via Outlet context — all driven by tenant config. The
 * Carrito nav entry only appears when the tenant has the shop module enabled.
 */
export default function TiendaLayout() {
  const config = useTenantConfig()
  const { items, addToCart, updateQuantity, removeItem } = useCart()

  useEffect(() => {
    applyTheme(config.themeName || TIENDA_THEME)
  }, [config.themeName])

  const base = TIENDA_BASE_PATH
  const navItems = [
    { to: base, label: 'Inicio' },
    { to: `${base}/productos`, label: 'Tienda' },
    ...(config.modules?.hasShop ? [{ to: `${base}/carrito`, label: 'Carrito' }] : []),
    { to: `${base}/contacto`, label: 'Contacto' },
  ]

  const context: TiendaOutletContext = { items, addToCart, updateQuantity, removeItem }

  return (
    <>
      <SharedJsonLd schema={buildStoreSchema(config, `${window.location.origin}${base}`)} />

      <header className={styles.header}>
        <Link to={base} className={styles.brand}>
          {config.businessName}
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} />
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <Outlet context={context} />
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
