import { fireEvent, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import { LanguageSelector } from './LanguageSelector'

const AVAILABLE_LOCALES = ['es', 'en', 'de', 'fr']

/**
 * Renders the selector inside a fresh i18n instance and returns a spy on its
 * `changeLanguage`, so each test asserts against an isolated instance.
 */
function renderSelector(currentLocale = 'es', onLocaleChange?: (locale: string) => void) {
  const i18n = createI18nInstance('es')
  const changeLanguage = vi.spyOn(i18n, 'changeLanguage')

  render(
    <I18nextProvider i18n={i18n}>
      <LanguageSelector
        availableLocales={AVAILABLE_LOCALES}
        currentLocale={currentLocale}
        onLocaleChange={onLocaleChange}
      />
    </I18nextProvider>,
  )

  return { changeLanguage }
}

describe('LanguageSelector', () => {
  it('renders one button per available locale with uppercase labels', () => {
    renderSelector()

    for (const locale of AVAILABLE_LOCALES) {
      expect(
        screen.getByRole('button', { name: locale.toUpperCase() }),
      ).toBeInTheDocument()
    }
  })

  it('marks the current locale with aria-current', () => {
    renderSelector('en')

    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: 'ES' })).not.toHaveAttribute('aria-current')
  })

  it('calls changeLanguage and onLocaleChange when a different locale is clicked', () => {
    const onLocaleChange = vi.fn()
    const { changeLanguage } = renderSelector('es', onLocaleChange)

    fireEvent.click(screen.getByRole('button', { name: 'DE' }))

    expect(changeLanguage).toHaveBeenCalledWith('de')
    expect(onLocaleChange).toHaveBeenCalledWith('de')
  })

  it('does nothing when the already-active locale is clicked', () => {
    const onLocaleChange = vi.fn()
    const { changeLanguage } = renderSelector('es', onLocaleChange)

    fireEvent.click(screen.getByRole('button', { name: 'ES' }))

    expect(changeLanguage).not.toHaveBeenCalled()
    expect(onLocaleChange).not.toHaveBeenCalled()
  })
})
