import { useEffect } from 'react'
import { Link, Outlet, useMatch } from 'react-router'
import styles from './MecanicoLayout.module.css'
import { Footer } from '../../../shared/components/Footer'
import { SharedJsonLd } from '../../../shared/seo'
import { applyTheme } from '../../../themes'
import { AUTO_REPAIR_SCHEMA, BASE_PATH, BUSINESS, LEGAL_LINKS } from './mecanicoData'

const NAV_ITEMS = [
  { to: BASE_PATH, label: 'Inicio' },
  { to: `${BASE_PATH}/servicios`, label: 'Servicios' },
  { to: `${BASE_PATH}/cita`, label: 'Cita Previa' },
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
 * Shared layout for the multi-page mechanic site (Taller Mecánico El Teide).
 * Renders the header (brand + primary nav), the routed page via `<Outlet>`
 * and the footer. Applies the `urbano` theme and injects AutoRepair structured
 * data shared across every page.
 */
export default function MecanicoLayout() {
  useEffect(() => {
    applyTheme('urbano')
  }, [])

  return (
    <>
      <SharedJsonLd schema={AUTO_REPAIR_SCHEMA} />

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
