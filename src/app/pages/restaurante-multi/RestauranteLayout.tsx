import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useMatch } from 'react-router'
import styles from './RestauranteLayout.module.css'
import { LanguageSelector } from '../../../shared/components/LanguageSelector'
import { Footer } from '../../../shared/components/Footer'
import { SharedJsonLd } from '../../../shared/seo'
import { SUPPORTED_LOCALES } from '../../../i18n'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import {
  RESTAURANTE_BASE_PATH,
  RESTAURANTE_THEME,
  LEGAL_LINKS,
  buildRestaurantSchema,
} from '../restaurante-landing/restauranteShared'

/** A single nav link that marks itself with aria-current when it matches the route. */
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
 * Shared layout for the multi-page restaurant site. Renders the header (brand,
 * primary nav and language selector), the routed page via `<Outlet>` and the
 * footer — all driven by tenant config. The Reservas nav entry only appears
 * when the tenant has the reservations module enabled.
 */
export default function RestauranteLayout() {
  const { i18n } = useTranslation()
  const config = useTenantConfig()

  useEffect(() => {
    applyTheme(config.themeName || RESTAURANTE_THEME)
  }, [config.themeName])

  const base = RESTAURANTE_BASE_PATH
  const navItems = [
    { to: base, label: 'Inicio' },
    { to: `${base}/carta`, label: 'Carta' },
    ...(config.modules?.hasReservations ? [{ to: `${base}/reservas`, label: 'Reservas' }] : []),
    { to: `${base}/contacto`, label: 'Contacto' },
  ]

  return (
    <>
      <SharedJsonLd schema={buildRestaurantSchema(config, `${window.location.origin}${base}`)} />

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

        <LanguageSelector availableLocales={[...SUPPORTED_LOCALES]} currentLocale={i18n.language} />
      </header>

      <main>
        <Outlet />
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
