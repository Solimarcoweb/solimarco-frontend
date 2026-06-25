import type { JSX } from 'react'
import { Link, useParams } from 'react-router'
import styles from './LegalPageRoute.module.css'
import { LEGAL_TYPE_BY_SLUG } from '../../models/legal'
import { LegalPageView } from '../LegalPageView'
import { getCurrentTenantId } from '../../../../core/tenant/tenantResolver'

/**
 * Global tenant route for `/legal/:slug` (e.g. `/legal/privacidad`). Resolves
 * the public URL slug to a backend `LegalPageType` via `LEGAL_TYPE_BY_SLUG` and
 * the current tenant from the hostname, then renders the legal page. Unknown
 * slugs render a 404 instead of hitting the backend.
 *
 * @returns The legal page view, or a 404 panel for an unknown slug.
 */
export default function LegalPageRoute(): JSX.Element {
  const { slug } = useParams<{ slug: string }>()
  const type = slug ? LEGAL_TYPE_BY_SLUG[slug] : undefined

  if (!type) {
    return (
      <main className={styles.notFound}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.message}>No encontramos esta página legal.</p>
        <Link to="/" className={styles.homeLink}>
          Volver al inicio
        </Link>
      </main>
    )
  }

  return <LegalPageView tenantSlug={getCurrentTenantId()} type={type} />
}
