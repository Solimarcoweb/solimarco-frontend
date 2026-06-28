import { useEffect } from 'react'
import { Link, Outlet, useMatch } from 'react-router'
import styles from './GenericoLayout.module.css'
import { Footer } from '../../../shared/components/Footer'
import { SharedJsonLd } from '../../../shared/seo'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import {
  GENERICO_BASE_PATH,
  GENERICO_THEME,
  LEGAL_LINKS,
  buildLocalBusinessSchema,
} from '../generico-landing/genericoShared'

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
 * Shared layout for the multi-page generic business site. Renders the header
 * (brand + primary nav), the routed page via `<Outlet>` and the footer — all
 * driven by tenant config. The Presupuesto nav entry only appears when the
 * tenant has the budget-form module enabled.
 */
export default function GenericoLayout() {
  const config = useTenantConfig()

  useEffect(() => {
    applyTheme(config.themeName || GENERICO_THEME)
  }, [config.themeName])

  const base = GENERICO_BASE_PATH
  const navItems = [
    { to: base, label: 'Inicio' },
    { to: `${base}/servicios`, label: 'Servicios' },
    ...(config.modules?.hasBudgetForm !== false
      ? [{ to: `${base}/presupuesto`, label: 'Presupuesto' }]
      : []),
    { to: `${base}/contacto`, label: 'Contacto' },
  ]

  return (
    <>
      <SharedJsonLd schema={buildLocalBusinessSchema(config, `${window.location.origin}${base}`)} />

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
