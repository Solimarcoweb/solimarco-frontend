import { useEffect } from 'react'
import type { TenantConfig } from './tenantConfig'

/**
 * Applies tenant-specific branding to the document as DOM side-effects.
 *
 * - `primaryColor` → injects `--color-primary` CSS variable on `:root`,
 *   removing it on unmount so the theme default is restored.
 * - `faviconUrl` → updates (or creates) the `<link rel="icon">` element
 *   in `<head>` so the browser tab shows the business favicon.
 *
 * `logoUrl` and `businessDescription` are consumed directly from the
 * `TenantConfig` object by whichever components need them; this hook
 * only handles the side-effects that must happen at the document level.
 *
 * @param config - The resolved tenant configuration, or `null` while loading.
 */
export function useTenantBranding(config: TenantConfig | null): void {
  const primaryColor = config?.primaryColor ?? null
  const faviconUrl = config?.faviconUrl ?? null

  useEffect(() => {
    if (!primaryColor) return
    document.documentElement.style.setProperty('--color-primary', primaryColor)
    return () => {
      document.documentElement.style.removeProperty('--color-primary')
    }
  }, [primaryColor])

  useEffect(() => {
    if (!faviconUrl) return
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = faviconUrl
  }, [faviconUrl])
}
