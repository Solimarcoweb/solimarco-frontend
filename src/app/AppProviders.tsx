import { useMemo, type ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { env } from '../core/constants/env'
import { createI18nInstance, type SupportedLocale } from '../i18n'

export interface AppProvidersProps {
  children: ReactNode
  /** Tenant's default UI locale; falls back to the build-time env default when omitted. */
  defaultLocale?: SupportedLocale
}

/**
 * Mounts every global provider required by the app shell: Helmet (for
 * per-page SEO tags) and i18n, scoped to a single instance per tenant.
 * The router itself is wired separately in `App.tsx` via `RouterProvider`.
 *
 * @param props.children - The app tree to render inside the providers.
 * @param props.defaultLocale - Tenant's default UI locale, normally injected
 * from the tenant configuration once it is loaded from the backend.
 */
export function AppProviders({ children, defaultLocale = env.defaultLocale }: AppProvidersProps) {
  const i18nInstance = useMemo(() => createI18nInstance(defaultLocale), [defaultLocale])

  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
    </HelmetProvider>
  )
}
