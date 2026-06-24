import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useMatch } from 'react-router'
import styles from './RestauranteLayout.module.css'
import { LanguageSelector } from '../../../shared/components/LanguageSelector'
import { Footer } from '../../../shared/components/Footer'
import { SharedJsonLd } from '../../../shared/seo'
import { SUPPORTED_LOCALES } from '../../../i18n'
import { applyTheme } from '../../../themes'
import { BASE_PATH, BUSINESS, LEGAL_LINKS, RESTAURANT_SCHEMA } from './restauranteData'

const NAV_ITEMS = [
  { to: BASE_PATH, label: 'Inicio' },
  { to: `${BASE_PATH}/carta`, label: 'Carta' },
  { to: `${BASE_PATH}/reservas`, label: 'Reservas' },
  { to: `${BASE_PATH}/contacto`, label: 'Contacto' },
]

/** A single nav link that marks itself with aria-current when it matches the route. */
function NavItem({ to, label }: { to: string; label: string }) {
  // useMatch matches the whole pathname, so the index link only activates on
  // the exact base path, not on its child routes.
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
 * Shared layout for the multi-page restaurant site (Restaurante El Drago).
 * Renders the header (brand, primary nav and language selector), the routed
 * page via `<Outlet>` and the footer. Applies the `calido` theme and injects
 * the Restaurant structured data shared across every page.
 */
export default function RestauranteLayout() {
  const { i18n } = useTranslation()

  useEffect(() => {
    applyTheme('calido')
  }, [])

  return (
    <>
      <SharedJsonLd schema={RESTAURANT_SCHEMA} />

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

        <LanguageSelector availableLocales={[...SUPPORTED_LOCALES]} currentLocale={i18n.language} />
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
