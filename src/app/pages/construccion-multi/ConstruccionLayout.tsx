import { useEffect } from 'react'
import { Link, Outlet, useMatch } from 'react-router'
import styles from './ConstruccionLayout.module.css'
import { Footer } from '../../../shared/components/Footer'
import { SharedJsonLd } from '../../../shared/seo'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import {
  CONSTRUCCION_BASE_PATH,
  CONSTRUCCION_THEME,
  LEGAL_LINKS,
  buildBusinessSchema,
} from '../construccion/construccionShared'

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
 * Shared layout for the multi-page construction site. Renders the header
 * (brand + primary nav) and footer from tenant config, the routed page via
 * `<Outlet>`, and injects the business structured data. The Showroom nav entry
 * only appears when the tenant has the shop module enabled.
 */
export default function ConstruccionLayout() {
  const config = useTenantConfig()

  useEffect(() => {
    applyTheme(config.themeName || CONSTRUCCION_THEME)
  }, [config.themeName])

  const base = CONSTRUCCION_BASE_PATH
  const navItems = [
    { to: base, label: 'Inicio' },
    { to: `${base}/servicios`, label: 'Servicios' },
    { to: `${base}/proyectos`, label: 'Proyectos' },
    ...(config.modules?.hasShop ? [{ to: `${base}/showroom`, label: 'Showroom' }] : []),
    { to: `${base}/contacto`, label: 'Contacto' },
  ]

  return (
    <>
      <SharedJsonLd schema={buildBusinessSchema(config, `${window.location.origin}${base}`)} />

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
