import { Helmet } from 'react-helmet-async'
import { useOptionalTenantConfig } from '../../core/tenant/TenantContext'

export interface SharedSeoProps {
  /** Page title, rendered in `<title>` and used as the Open Graph title fallback. */
  title: string
  /** Meta description, also used as the Open Graph description fallback. */
  description?: string
  /** Canonical URL for this page, to avoid duplicate-content penalties. */
  canonicalUrl?: string
  /** Open Graph title override, defaults to `title`. */
  ogTitle?: string
  /** Open Graph description override, defaults to `description`. */
  ogDescription?: string
  /** Open Graph image URL. */
  ogImage?: string
  /** Meta robots directive, e.g. "noindex,nofollow". */
  robots?: string
}

/**
 * Reusable page-level SEO component built on react-helmet-async.
 * Each page/feature renders this once with its own title, description,
 * canonical URL, Open Graph tags and robots directive instead of duplicating
 * `<Helmet>` markup across the codebase.
 *
 * @param props - SEO fields for the current page.
 */
export function SharedSeo({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  robots,
}: SharedSeoProps) {
  const tenantConfig = useOptionalTenantConfig()
  const effectiveDescription = description ?? tenantConfig?.businessDescription
  const resolvedOgDescription = ogDescription ?? effectiveDescription

  return (
    <Helmet>
      <title>{title}</title>
      {effectiveDescription && <meta name="description" content={effectiveDescription} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {robots && <meta name="robots" content={robots} />}
      <meta property="og:title" content={ogTitle ?? title} />
      {resolvedOgDescription && <meta property="og:description" content={resolvedOgDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
    </Helmet>
  )
}
