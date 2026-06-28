import { createContext, useContext } from 'react'

/**
 * Single source of truth for the construccion primary navigation. Header, footer
 * and {@link computeBase} all derive from this list, so adding/removing a page
 * is a one-line change here.
 *
 * - `seg`: route segment for the multi-page site (`''` = index/home).
 * - `anchorId`: in-page anchor id for the single-page landing.
 * - `labelKey`: i18n key for the link label.
 * - `end`: NavLink `end` flag (only the index needs it).
 */
export const CONSTRUCCION_NAV = [
  { seg: '', anchorId: 'top', labelKey: 'construccion.nav.home', end: true },
  { seg: 'servicios', anchorId: 'servicios', labelKey: 'construccion.nav.services', end: false },
  { seg: 'proyectos', anchorId: 'proyectos', labelKey: 'construccion.nav.projects', end: false },
  { seg: 'showroom', anchorId: 'showroom', labelKey: 'construccion.nav.showroom', end: false },
  { seg: 'contacto', anchorId: 'contacto', labelKey: 'construccion.nav.contact', end: false },
] as const

/** Child route segments (derived from {@link CONSTRUCCION_NAV}; excludes the index). */
export const CHILD_SEGS: string[] = CONSTRUCCION_NAV.map((i) => i.seg).filter(Boolean)

/**
 * Base pathname where the multi-page construccion site is mounted, shared so the
 * sector's link components build ABSOLUTE route targets that are correct in both
 * mounts (dev preview at `/construccion-multi`, production tenant at `/`).
 *
 * `null` means "no router base in scope" — the single-page landing, where links
 * use in-page `#` anchors instead.
 */
export const ConstruccionRouteBaseContext = createContext<string | null>(null)

/** Reads the current construccion route base (or `null` on the landing). */
export function useConstruccionRouteBase(): string | null {
  return useContext(ConstruccionRouteBaseContext)
}

/**
 * Derives the layout base from the current pathname by dropping a trailing known
 * child segment (index keeps the full path). Reliable in every mount, unlike
 * `useResolvedPath('.')`, which returns the leaf (not the base) when the layout
 * route is pathless inside descendant `<Routes>` (the production TenantRouter).
 *
 * @param pathname - Current location pathname.
 * @returns The layout base pathname (e.g. `/construccion-multi` or `/`).
 */
export function computeBase(pathname: string): string {
  const segs = pathname.replace(/\/+$/, '').split('/')
  if (CHILD_SEGS.includes(segs[segs.length - 1])) segs.pop()
  const base = segs.join('/')
  return base === '' ? '/' : base
}

/**
 * Joins a base pathname with a child segment, avoiding double slashes.
 *
 * @param base - Base pathname (e.g. `/construccion-multi` or `/`).
 * @param segment - Child segment (e.g. `servicios`); empty returns the base.
 * @returns The absolute path.
 */
export function joinBase(base: string, segment: string): string {
  if (!segment) return base
  return `${base.replace(/\/$/, '')}/${segment}`
}
