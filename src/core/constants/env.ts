import type { SupportedLocale } from '../../i18n'
import { SUPPORTED_LOCALES } from '../../i18n'

/**
 * Centralized, typed access to build-time environment variables.
 * Avoids scattering raw `import.meta.env.VITE_*` reads across the codebase.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  defaultLocale: resolveDefaultLocale(import.meta.env.VITE_DEFAULT_LOCALE),
} as const

/**
 * Validates the raw `VITE_DEFAULT_LOCALE` value against the supported locales,
 * falling back to Spanish when it is missing or not one of the supported ones.
 * The actual tenant default locale (from backend configuration) will override
 * this at the point where `createI18nInstance` is called.
 *
 * @param rawLocale - Raw value coming from the environment variable.
 * @returns A validated `SupportedLocale`.
 */
function resolveDefaultLocale(rawLocale: string | undefined): SupportedLocale {
  return SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale)
    ? (rawLocale as SupportedLocale)
    : 'es'
}
