import { useEffect } from 'react'
import { Link, Outlet, useMatch } from 'react-router'
import styles from './PeluqueriaLayout.module.css'
import { Footer } from '../../../shared/components/Footer'
import { SharedJsonLd } from '../../../shared/seo'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import {
  PELUQUERIA_BASE_PATH,
  PELUQUERIA_THEME,
  LEGAL_LINKS,
  buildHairSalonSchema,
} from '../peluqueria-landing/peluqueriaShared'

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
 * Shared layout for the multi-page peluqueria site. Renders the header (brand +
 * primary nav), the routed page via `<Outlet>` and the footer — all driven by
 * tenant config. The Cita nav entry only appears when the tenant has the
 * appointments module enabled.
 */
export default function PeluqueriaLayout() {
  const config = useTenantConfig()

  useEffect(() => {
    applyTheme(config.themeName || PELUQUERIA_THEME)
  }, [config.themeName])

  const base = PELUQUERIA_BASE_PATH
  const navItems = [
    { to: base, label: 'Inicio' },
    { to: `${base}/servicios`, label: 'Servicios' },
    ...(config.modules?.hasCitas ? [{ to: `${base}/cita`, label: 'Cita' }] : []),
    { to: `${base}/contacto`, label: 'Contacto' },
  ]

  return (
    <>
      <SharedJsonLd schema={buildHairSalonSchema(config, `${window.location.origin}${base}`)} />

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
