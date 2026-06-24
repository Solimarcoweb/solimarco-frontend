import { useEffect, useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import styles from './LegalPageView.module.css'
import type { LegalPage } from '../../models/legal'
import { getLegalPage } from '../../services/legalService'

/**
 * Sanitisation whitelist for legal page bodies. The content is trusted (it
 * comes from our own backend), but we sanitise as defense-in-depth so a
 * compromised/misconfigured backend can never inject scripts or event handlers.
 * Only the inline/block tags legal copy needs are allowed; `a` keeps just the
 * href and safe linking attributes.
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'br'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
}

export interface LegalPageViewProps {
  /** Tenant the legal page belongs to. */
  tenantId: string
  /** Legal page slug to load, e.g. "privacidad", "cookies", "aviso-legal". */
  slug: string
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; page: LegalPage }

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** Formats an ISO date string for display, leaving it untouched if unparseable. */
function formatUpdatedAt(isoDate: string): string {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? isoDate : dateFormatter.format(date)
}

/**
 * Renders a tenant's published legal page (privacy, cookies, legal notice...).
 * Loads the page through `legalService` and handles the loading, error and
 * success states. The HTML body comes from our own backend (not user input);
 * it is injected with `dangerouslySetInnerHTML` but sanitised with DOMPurify
 * first (see `SANITIZE_CONFIG`) as defense-in-depth.
 *
 * @param props.tenantId - Tenant the legal page belongs to.
 * @param props.slug - Legal page slug to load.
 * @returns The legal page as a `<main>` landmark.
 */
export function LegalPageView({ tenantId, slug }: LegalPageViewProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [loadedKey, setLoadedKey] = useState(`${tenantId}/${slug}`)

  // Reset back to the loading state synchronously during render when the target
  // page changes, so stale content is never shown while the new page loads.
  // This is React's recommended pattern for prop-derived resets, preferred over
  // calling setState inside the effect.
  const requestKey = `${tenantId}/${slug}`
  if (loadedKey !== requestKey) {
    setLoadedKey(requestKey)
    setState({ status: 'loading' })
  }

  useEffect(() => {
    // Guard against setting state after unmount or after the tenant/slug
    // changed while a previous request was still in flight.
    let active = true

    getLegalPage(tenantId, slug)
      .then((page) => {
        if (active) setState({ status: 'success', page })
      })
      .catch(() => {
        if (active) setState({ status: 'error' })
      })

    return () => {
      active = false
    }
  }, [tenantId, slug])

  // Sanitise once per content change, not on every render. Computed
  // unconditionally (before the early returns) to respect the rules of hooks.
  const rawContent = state.status === 'success' ? state.page.content : ''
  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(rawContent, SANITIZE_CONFIG),
    [rawContent],
  )

  if (state.status === 'loading') {
    return (
      <main className={styles.page}>
        <p className={styles.status} role="status">
          Cargando…
        </p>
      </main>
    )
  }

  if (state.status === 'error') {
    return (
      <main className={styles.page}>
        <p className={styles.status} role="alert">
          No se ha podido cargar esta página. Inténtalo de nuevo en unos minutos.
        </p>
      </main>
    )
  }

  const { page } = state

  return (
    <main className={styles.page}>
      <article className={styles.document}>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.updated}>Última actualización: {formatUpdatedAt(page.updatedAt)}</p>
        {/* Trusted HTML from our own backend, sanitised with DOMPurify as defense-in-depth. */}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </article>
    </main>
  )
}
