import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AppProviders } from './AppProviders'

afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
})

describe('AppProviders', () => {
  it('applies the fallback theme (clasico) by default', () => {
    render(
      <AppProviders>
        <div>content</div>
      </AppProviders>,
    )

    expect(document.documentElement.getAttribute('data-theme')).toBe('clasico')
  })

  it('applies the tenant theme when a themeName is provided', () => {
    render(
      <AppProviders themeName="mediterraneo">
        <div>content</div>
      </AppProviders>,
    )

    expect(document.documentElement.getAttribute('data-theme')).toBe('mediterraneo')
  })
})
