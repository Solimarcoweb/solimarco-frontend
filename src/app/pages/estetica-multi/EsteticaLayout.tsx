import { useEffect } from 'react'
import { Link, Outlet, useMatch } from 'react-router'
import styles from './EsteticaLayout.module.css'
import { Footer } from '../../../shared/components/Footer'
import { SharedJsonLd } from '../../../shared/seo'
import { applyTheme } from '../../../themes'
import { BASE_PATH, BEAUTY_SALON_SCHEMA, BUSINESS, LEGAL_LINKS } from './esteticaData'

const NAV_ITEMS = [
  { to: BASE_PATH, label: 'Inicio' },
  { to: `${BASE_PATH}/tratamientos`, label: 'Tratamientos' },
  { to: `${BASE_PATH}/cita`, label: 'Cita' },
  { to: `${BASE_PATH}/contacto`, label: 'Contacto' },
]

/** Nav link that marks itself with aria-current when it matches the route exactly. */
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
 * Shared layout for the multi-page estetica site (Centro Estético Magnolia).
 * Renders the header (brand + primary nav), the routed page via `<Outlet>` and
 * the footer. Applies the `editorial` theme and injects BeautySalon structured
 * data shared across every page.
 */
export default function EsteticaLayout() {
  useEffect(() => {
    applyTheme('editorial')
  }, [])

  return (
    <>
      <SharedJsonLd schema={BEAUTY_SALON_SCHEMA} />

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
        <Outlet />
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
