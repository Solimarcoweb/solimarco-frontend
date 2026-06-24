import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, FALLBACK_THEME, THEME_NAMES, themeLoaders } from './index'

describe('applyTheme', () => {
  beforeEach(() => {
    // Stub every theme loader so no real CSS bundle is imported during tests.
    for (const name of THEME_NAMES) {
      vi.spyOn(themeLoaders, name).mockResolvedValue(undefined)
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.documentElement.removeAttribute('data-theme')
  })

  it('loads the requested theme bundle and marks the document', () => {
    applyTheme('mediterraneo')

    expect(themeLoaders.mediterraneo).toHaveBeenCalledTimes(1)
    expect(document.documentElement.getAttribute('data-theme')).toBe('mediterraneo')
  })

  it('loads only the requested theme, not the others', () => {
    applyTheme('urbano')

    expect(themeLoaders.urbano).toHaveBeenCalledTimes(1)
    expect(themeLoaders.editorial).not.toHaveBeenCalled()
    expect(themeLoaders.clasico).not.toHaveBeenCalled()
  })

  it('falls back to clasico when the theme is unknown', () => {
    applyTheme('does-not-exist')

    expect(themeLoaders.clasico).toHaveBeenCalledTimes(1)
    expect(document.documentElement.getAttribute('data-theme')).toBe(FALLBACK_THEME)
    expect(document.documentElement.getAttribute('data-theme')).toBe('clasico')
  })

  it('does not load the requested name when it is unknown', () => {
    applyTheme('rainbow')

    // No loader keyed by the unknown name exists; only the fallback runs.
    expect(themeLoaders.clasico).toHaveBeenCalledTimes(1)
  })
})
