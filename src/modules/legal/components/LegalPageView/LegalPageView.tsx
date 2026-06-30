import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import DOMPurify from 'dompurify'
import styles from './LegalPageView.module.css'
import { LEGAL_PAGE_TITLES, type LegalPage, type LegalPageType } from '../../models/legal'
import { getLegalPage } from '../../services/legalService'
import { formatLegalContent } from '../../shared/formatLegalContent'
import { LegalSkeleton } from '../LegalSkeleton'

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
  /** Tenant slug the legal page belongs to (not a UUID). */
  tenantSlug: string
  /** Legal page type to load (backend enum), e.g. "POLITICA_PRIVACIDAD". */
  type: LegalPageType
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
function formatPublishedAt(isoDate: string): string {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? isoDate : dateFormatter.format(date)
}

/**
 * Renders a tenant's published legal page (privacy, cookies, legal notice...).
 * Loads the page through `legalService` and handles the loading, error and
 * success states. The H1 title is derived from the legal `type` (the backend
 * response has no title). The body is normalised by {@link formatLegalContent}
 * (plain-text → paragraphs, with a leading bracketed disclaimer lifted into a
 * callout) and then injected with `dangerouslySetInnerHTML`, sanitised with
 * DOMPurify first as defense-in-depth. Back actions let the visitor return.
 *
 * @param props.tenantSlug - Tenant slug the legal page belongs to.
 * @param props.type - Legal page type to load (backend enum).
 * @returns The legal page as a `<main>` landmark.
 */
export function LegalPageView({ tenantSlug, type }: LegalPageViewProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [loadedKey, setLoadedKey] = useState(`${tenantSlug}/${type}`)

  // Reset back to the loading state synchronously during render when the target
  // page changes, so stale content is never shown while the new page loads.
  const requestKey = `${tenantSlug}/${type}`
  if (loadedKey !== requestKey) {
    setLoadedKey(requestKey)
    setState({ status: 'loading' })
  }

  useEffect(() => {
    // Guard against setting state after unmount or after the tenant/type
    // changed while a previous request was still in flight.
    let active = true

    getLegalPage(tenantSlug, type)
      .then((page) => {
        if (active) setState({ status: 'success', page })
      })
      .catch(() => {
        if (active) setState({ status: 'error' })
      })

    return () => {
      active = false
    }
  }, [tenantSlug, type])

  // Format + sanitise once per content change, not on every render. Computed
  // unconditionally (before the early returns) to respect the rules of hooks.
  const rawContent = state.status === 'success' ? state.page.content : ''
  const { notice, sanitizedContent } = useMemo(() => {
    const formatted = formatLegalContent(rawContent)
    return {
      notice: formatted.notice,
      sanitizedContent: DOMPurify.sanitize(formatted.bodyHtml, SANITIZE_CONFIG),
    }
  }, [rawContent])

  if (state.status === 'loading') {
    return (
      <main className={styles.page}>
        <LegalSkeleton />
      </main>
    )
  }

  if (state.status === 'error') {
    return (
      <main className={styles.page}>
        <p className={styles.status} role="alert">
          {t('legal.error')}
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.backHome}>
            {t('legal.backHome')}
          </Link>
        </div>
      </main>
    )
  }

  const { page } = state

  return (
    <main className={styles.page}>
      <article className={styles.document}>
        <h1 className={styles.title}>{LEGAL_PAGE_TITLES[page.type]}</h1>
        <p className={styles.updated}>
          {t('legal.updated')}: {formatPublishedAt(page.publishedAt)}
        </p>

        {notice && (
          <aside className={styles.notice} role="note">
            {notice}
          </aside>
        )}

        {/* Body normalised by formatLegalContent, sanitised with DOMPurify. */}
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

        <div className={styles.actions}>
          <button type="button" className={styles.backPrev} onClick={() => navigate(-1)}>
            {t('legal.backPrev')}
          </button>
          <Link to="/" className={styles.backHome}>
            {t('legal.backHome')}
          </Link>
        </div>
      </article>
    </main>
  )
}
