import { useEffect } from 'react'
import { Link, Outlet, useMatch } from 'react-router'
import styles from './TiendaLayout.module.css'
import { Footer } from '../../../shared/components/Footer'
import { SharedJsonLd } from '../../../shared/seo'
import { useCart } from '../../../modules/sales/shared/useCart'
import { applyTheme } from '../../../themes'
import { BASE_PATH, BUSINESS, LEGAL_LINKS, STORE_SCHEMA } from './tiendaData'
import type { CartItem, ProductItem } from '../../../modules/sales/models/product'

/** Shape of the context passed to child pages via React Router's Outlet. */
export interface TiendaOutletContext {
  items: CartItem[]
  addToCart: (product: ProductItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
}

const NAV_ITEMS = [
  { to: BASE_PATH, label: 'Inicio' },
  { to: `${BASE_PATH}/productos`, label: 'Tienda' },
  { to: `${BASE_PATH}/carrito`, label: 'Carrito' },
  { to: `${BASE_PATH}/contacto`, label: 'Contacto' },
]

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
 * Shared layout for the multi-page tienda site (El Rincón Canario).
 * Owns the cart state and exposes it to child pages via Outlet context.
 * Applies the `fresco` theme and injects Store structured data shared across
 * every page.
 */
export default function TiendaLayout() {
  const { items, addToCart, updateQuantity, removeItem } = useCart()

  useEffect(() => {
    applyTheme('fresco')
  }, [])

  const context: TiendaOutletContext = { items, addToCart, updateQuantity, removeItem }

  return (
    <>
      <SharedJsonLd schema={STORE_SCHEMA} />

      <header className={styles.header}>
        <Link to={BASE_PATH} className={styles.brand}>
          {BUSINESS.name}
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} />
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <Outlet context={context} />
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
