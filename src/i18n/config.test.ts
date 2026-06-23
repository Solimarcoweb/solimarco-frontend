import { describe, expect, it } from 'vitest'
import { createI18nInstance, SUPPORTED_LOCALES } from './config'

describe('createI18nInstance', () => {
  it.each(SUPPORTED_LOCALES)('resolves UI strings for locale "%s"', (locale) => {
    const instance = createI18nInstance(locale)

    expect(instance.t('nav.home')).toBeTruthy()
    expect(instance.t('common.loading')).toBeTruthy()
  })

  it('falls back to Spanish when an unknown key is requested', () => {
    const instance = createI18nInstance('en')

    expect(instance.t('nav.home')).toBe('Home')
  })
})
