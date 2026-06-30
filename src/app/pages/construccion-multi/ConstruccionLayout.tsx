import { useEffect, type CSSProperties } from 'react'
import { Outlet, useLocation } from 'react-router'
import styles from '../construccion/ConstruccionPage.module.css'
import ConstruccionHeader from '../construccion/components/ConstruccionHeader'
import ConstruccionFooter from '../construccion/components/ConstruccionFooter'
import {
  ConstruccionRouteBaseContext,
  computeBase,
} from '../construccion/components/construccionRouteBase'
import { SharedJsonLd } from '../../../shared/seo'
import { applyTheme } from '../../../themes'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import {
  CONSTRUCCION_BASE_PATH,
  CONSTRUCCION_THEME,
  buildBusinessSchema,
} from '../construccion/construccionShared'

/**
 * Shell for the redesigned multi-page construccion site. Reuses the sector
 * header (route variant, with active highlighting) and footer, wraps the routed
 * page via `<Outlet>` and applies the dark/gold sector palette. Branding/contact
 * come from `useTenantConfig`; per-page content is fetched in each child page.
 */
export default function ConstruccionLayout() {
  const config = useTenantConfig()
  const location = useLocation()
  // Where this layout is mounted, derived from the current pathname (leaf-aware).
  // `/construccion-multi` in the dev preview, `/` for a production tenant.
  // NOTE: not `useResolvedPath('.')` — that returns the leaf (not the base) when
  // the layout route is pathless inside descendant <Routes> (production mount).
  const base = computeBase(location.pathname)

  // The construccion sector is dark by theme (obsidiana); apply it so the
  // document is dark from the first paint. No <html> repaint needed — the theme
  // owns the surface.
  useEffect(() => {
    applyTheme(CONSTRUCCION_THEME)
  }, [])

  // Scroll to top on route change (multi-page navigation).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  const accentStyle = config.primaryColor
    ? ({ '--accent': config.primaryColor } as CSSProperties)
    : undefined

  return (
    <ConstruccionRouteBaseContext.Provider value={base}>
      <div className={styles.page} style={accentStyle}>
        <SharedJsonLd
          schema={buildBusinessSchema(config, `${window.location.origin}${CONSTRUCCION_BASE_PATH}`)}
        />

        <ConstruccionHeader businessName={config.businessName} variant="route" />

        <main>
          <Outlet />
        </main>

        <ConstruccionFooter config={config} variant="route" />
      </div>
    </ConstruccionRouteBaseContext.Provider>
  )
}
