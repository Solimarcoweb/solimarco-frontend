import { lazy, Suspense, type JSX } from 'react'
import styles from './LegalChrome.module.css'
import { LegalSkeleton } from '../../../modules/legal/components/LegalSkeleton'

// LegalChrome stays lazy: it pulls in the sector header/footer + DOMPurify, so
// keep that out of the main bundle. This wrapper is tiny and not lazy, so it can
// render a theme-coherent fallback synchronously while that chunk loads.
const LegalChrome = lazy(() => import('./LegalChrome'))

/**
 * Full-viewport loading surface shown while the LegalChrome chunk downloads.
 * Theme-driven (`var(--color-bg)`), so it matches the active sector's surface
 * (dark for construccion's obsidiana theme, light elsewhere) without a per-sector
 * variant. Hosts the SAME {@link LegalSkeleton} as the in-view loading state, so
 * the chunk-load → content-fetch transition is one continuous skeleton.
 */
export function LegalFallback(): JSX.Element {
  return (
    <div className={styles.fallback}>
      <LegalSkeleton />
    </div>
  )
}

/**
 * Route element for `/legal/:slug`. Wraps the lazy {@link LegalChrome} in its own
 * Suspense boundary with a theme-coherent full-viewport skeleton fallback, so the
 * lazy chunk load never shows the generic unstyled fallback on a mismatched
 * background — eliminating the flash.
 */
export default function LegalRoute(): JSX.Element {
  return (
    <Suspense fallback={<LegalFallback />}>
      <LegalChrome />
    </Suspense>
  )
}
