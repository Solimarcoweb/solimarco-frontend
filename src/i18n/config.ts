import i18next, { type i18n } from 'i18next'
import { initReactI18next } from 'react-i18next'
import deTranslation from './locales/de/translation.json'
import enTranslation from './locales/en/translation.json'
import esTranslation from './locales/es/translation.json'
import frTranslation from './locales/fr/translation.json'

export const SUPPORTED_LOCALES = ['es', 'en', 'de', 'fr'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const resources = {
  es: { translation: esTranslation },
  en: { translation: enTranslation },
  de: { translation: deTranslation },
  fr: { translation: frTranslation },
}

/**
 * Creates an i18next instance scoped to a single tenant.
 * The default locale is always injected by the caller (tenant configuration
 * coming from the backend) instead of being hardcoded, since each business
 * site can define its own default UI language.
 *
 * @param defaultLocale - Locale to use as the tenant's default UI language.
 * @returns An initialized i18next instance ready to be used with `I18nextProvider`.
 */
export function createI18nInstance(defaultLocale: SupportedLocale): i18n {
  const instance = i18next.createInstance()

  void instance.use(initReactI18next).init({
    resources,
    lng: defaultLocale,
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
  })

  return instance
}
