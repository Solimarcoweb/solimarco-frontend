import { useTranslation } from 'react-i18next'
import styles from './LanguageSelector.module.css'

export interface LanguageSelectorProps {
  /** Locale codes the tenant site offers, e.g. `['es', 'en', 'de', 'fr']`. */
  availableLocales: string[]
  /** Currently active locale code; the matching option is highlighted. */
  currentLocale: string
  /** Optional callback fired after the language changes, with the new locale code. */
  onLocaleChange?: (locale: string) => void
}

/**
 * Language switcher for the public per-tenant sites.
 * Rendered as a group of buttons (more accessible than a native `<select>`
 * for a small, always-visible set of locales) where the active locale is
 * marked with `aria-current`. Changing the language calls
 * `i18n.changeLanguage()` and then the optional `onLocaleChange` callback.
 *
 * @param props.availableLocales - Locale codes to offer as options.
 * @param props.currentLocale - Currently active locale code.
 * @param props.onLocaleChange - Optional callback invoked with the new locale.
 * @returns The language selector group.
 */
export function LanguageSelector({
  availableLocales,
  currentLocale,
  onLocaleChange,
}: LanguageSelectorProps) {
  const { i18n } = useTranslation()

  const handleSelect = (locale: string): void => {
    if (locale === currentLocale) {
      return
    }
    void i18n.changeLanguage(locale)
    onLocaleChange?.(locale)
  }

  return (
    <div className={styles.selector} role="group" aria-label="Seleccionar idioma">
      {availableLocales.map((locale) => {
        const isActive = locale === currentLocale
        const className = isActive ? `${styles.option} ${styles.active}` : styles.option

        return (
          <button
            key={locale}
            type="button"
            className={className}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => handleSelect(locale)}
          >
            {locale.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
