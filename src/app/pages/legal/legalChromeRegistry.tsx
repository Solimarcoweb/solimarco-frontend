import type { CSSProperties, JSX, ReactNode } from 'react'
import { Link } from 'react-router'
import pageStyles from '../construccion/ConstruccionPage.module.css'
import styles from './LegalChrome.module.css'
import ConstruccionHeader from '../construccion/components/ConstruccionHeader'
import ConstruccionFooter from '../construccion/components/ConstruccionFooter'
import { ConstruccionRouteBaseContext } from '../construccion/components/construccionRouteBase'
import { LEGAL_LINKS } from '../construccion/construccionShared'
import { Footer } from '../../../shared/components/Footer'
import type { LegalLink } from '../../../shared/components/Footer'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'

/** Props every sector chrome receives: the tenant config + the legal content. */
export interface ChromeProps {
  config: TenantConfig
  children: ReactNode
}

/** Legal links for the generic fallback footer (sectors without own chrome). */
const GENERIC_LEGAL_LINKS: LegalLink[] = [
  { label: 'Aviso legal', href: '/legal/aviso-legal' },
  { label: 'Política de privacidad', href: '/legal/privacidad' },
  { label: 'Política de cookies', href: '/legal/cookies' },
]

/** Inline `style` carrying the tenant's accent override, when present. */
function accentVar(config: TenantConfig): CSSProperties | undefined {
  return config.primaryColor ? ({ '--accent': config.primaryColor } as CSSProperties) : undefined
}

/** Splits a business name into [firstWord, rest] for the two-tone brand mark. */
function brandParts(name: string): [string, string] {
  const [first, ...rest] = name.split(' ')
  return [first, rest.join(' ')]
}

/**
 * Construccion chrome (dark/gold). FULL tenants get the real sector header +
 * footer (route nav anchored to the tenant root `/`); LANDING tenants get a
 * minimal header/footer (logo → home + legal links), since a single-page site
 * has no `/servicios`-style routes to navigate to.
 */
function ConstruccionChrome({ config, children }: ChromeProps): JSX.Element {
  const [first, rest] = brandParts(config.businessName)
  // The active theme (obsidiana, applied by TenantProvider for the construccion
  // sector) owns the dark surface; `.page` only adds the sector's extra tokens.
  const wrapperClass = pageStyles.page

  if (config.siteType === 'FULL') {
    return (
      <ConstruccionRouteBaseContext.Provider value="/">
        <div className={wrapperClass} style={accentVar(config)}>
          <ConstruccionHeader businessName={config.businessName} variant="route" />
          <main className={styles.construccionMain}>{children}</main>
          <ConstruccionFooter config={config} variant="route" />
        </div>
      </ConstruccionRouteBaseContext.Provider>
    )
  }

  const brand = (
    <>
      {first}
      {rest && <span> {rest}</span>}
    </>
  )
  return (
    <div className={wrapperClass} style={accentVar(config)}>
      <header className={styles.miniHeader}>
        <Link to="/" className={styles.miniBrand} aria-label={config.businessName}>
          {brand}
        </Link>
      </header>
      <main>{children}</main>
      <footer className={styles.miniFooter}>
        <Link to="/" className={styles.miniBrand} aria-label={config.businessName}>
          {brand}
        </Link>
        <nav className={styles.miniLegal} aria-label="Legal">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} to={l.href} className={styles.miniLegalLink}>
              {l.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  )
}

/**
 * Generic fallback chrome for sectors not yet redesigned: a minimal branded
 * header (logo → home) + the shared `Footer`, on the active theme (light).
 */
function GenericChrome({ config, children }: ChromeProps): JSX.Element {
  return (
    <div className={styles.generic}>
      <header className={styles.genericHeader}>
        <Link to="/" className={styles.genericBrand}>
          {config.businessName}
        </Link>
      </header>
      <main>{children}</main>
      <Footer
        businessName={config.businessName}
        address={config.address ?? ''}
        phone={config.phone ?? ''}
        email={config.email ?? ''}
        legalLinks={GENERIC_LEGAL_LINKS}
      />
    </div>
  )
}

/**
 * Per-sector chrome registry: wraps the legal content in the active sector's
 * header/footer/palette. Add a `case` here as each sector is redesigned;
 * unmapped sectors fall back to the generic chrome.
 *
 * @param props.config - Active tenant config (its `sector` selects the chrome).
 * @param props.children - The legal page content to wrap.
 */
export function SectorChrome({ config, children }: ChromeProps): JSX.Element {
  switch (config.sector) {
    case 'construccion':
      return <ConstruccionChrome config={config}>{children}</ConstruccionChrome>
    default:
      return <GenericChrome config={config}>{children}</GenericChrome>
  }
}
