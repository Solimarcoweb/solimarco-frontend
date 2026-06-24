import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useTenantBranding } from './useTenantBranding'
import type { TenantConfig } from './tenantConfig'

const BASE_CONFIG: TenantConfig = {
  tenantId: 'test',
  businessName: 'Test Business',
  themeName: 'clasico',
  pageType: 'landing',
  sector: 'generico',
  locale: 'es',
}

afterEach(() => {
  document.documentElement.style.removeProperty('--color-primary')
  document.querySelectorAll('link[rel="icon"]').forEach((el) => el.remove())
})

describe('useTenantBranding', () => {
  it('sets --color-primary CSS variable when primaryColor is provided', () => {
    renderHook(() =>
      useTenantBranding({ ...BASE_CONFIG, primaryColor: '#E63946' }),
    )

    expect(
      document.documentElement.style.getPropertyValue('--color-primary'),
    ).toBe('#E63946')
  })

  it('removes --color-primary on unmount', () => {
    document.documentElement.style.setProperty('--color-primary', '#E63946')

    const { unmount } = renderHook(() =>
      useTenantBranding({ ...BASE_CONFIG, primaryColor: '#E63946' }),
    )

    unmount()

    expect(
      document.documentElement.style.getPropertyValue('--color-primary'),
    ).toBe('')
  })

  it('does not set --color-primary when primaryColor is absent', () => {
    renderHook(() => useTenantBranding(BASE_CONFIG))

    expect(
      document.documentElement.style.getPropertyValue('--color-primary'),
    ).toBe('')
  })

  it('creates and sets the favicon link element when faviconUrl is provided', () => {
    renderHook(() =>
      useTenantBranding({ ...BASE_CONFIG, faviconUrl: 'https://example.com/favicon.ico' }),
    )

    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    expect(link).not.toBeNull()
    expect(link?.href).toBe('https://example.com/favicon.ico')
  })

  it('updates an existing favicon link element instead of creating a duplicate', () => {
    const existing = document.createElement('link')
    existing.rel = 'icon'
    existing.href = 'https://example.com/old.ico'
    document.head.appendChild(existing)

    renderHook(() =>
      useTenantBranding({ ...BASE_CONFIG, faviconUrl: 'https://example.com/new.ico' }),
    )

    const links = document.querySelectorAll('link[rel="icon"]')
    expect(links).toHaveLength(1)
    expect((links[0] as HTMLLinkElement).href).toBe('https://example.com/new.ico')
  })

  it('does nothing when config is null', () => {
    renderHook(() => useTenantBranding(null))

    expect(
      document.documentElement.style.getPropertyValue('--color-primary'),
    ).toBe('')
    expect(document.querySelector('link[rel="icon"]')).toBeNull()
  })
})
