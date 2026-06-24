import { useEffect, useMemo, type ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { env } from '../core/constants/env'
import { createI18nInstance, type SupportedLocale } from '../i18n'
import { applyTheme, FALLBACK_THEME } from '../themes'

export interface AppProvidersProps {
  children: ReactNode
  /** Tenant's default UI locale; falls back to the build-time env default when omitted. */
  defaultLocale?: SupportedLocale
  /**
   * Tenant theme to apply to the document. Defaults to the fallback theme
   * (`clasico`); replace with `tenant.themeName` once the tenant configuration
   * is loaded from the backend.
   */
  themeName?: string
}

/**
 * Mounts every global provider required by the app shell: Helmet (for
 * per-page SEO tags) and i18n, scoped to a single instance per tenant, and
 * applies the tenant theme to the document.
 * The router itself is wired separately in `App.tsx` via `RouterProvider`.
 *
 * @param props.children - The app tree to render inside the providers.
 * @param props.defaultLocale - Tenant's default UI locale, normally injected
 * from the tenant configuration once it is loaded from the backend.
 * @param props.themeName - Tenant theme name; defaults to the fallback theme.
 */
export function AppProviders({
  children,
  defaultLocale = env.defaultLocale,
  themeName = FALLBACK_THEME,
}: AppProvidersProps) {
  const i18nInstance = useMemo(() => createI18nInstance(defaultLocale), [defaultLocale])

  // Apply the tenant theme as a side effect (applyTheme touches the document).
  useEffect(() => {
    applyTheme(themeName)
  }, [themeName])

  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
    </HelmetProvider>
  )
}
