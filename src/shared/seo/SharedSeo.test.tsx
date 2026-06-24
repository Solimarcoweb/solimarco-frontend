import { render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { SharedSeo } from './SharedSeo'

vi.mock('../../core/tenant/TenantContext', () => ({
  useOptionalTenantConfig: vi.fn().mockReturnValue(null),
}))

describe('SharedSeo', () => {
  it('sets the document title and meta description', async () => {
    render(
      <HelmetProvider>
        <SharedSeo title="Test page" description="Test description" />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.title).toBe('Test page')
      expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
        'content',
        'Test description',
      )
    })
  })

  it('falls back to title/description for Open Graph tags when not overridden', async () => {
    render(
      <HelmetProvider>
        <SharedSeo title="Test page" description="Test description" />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
        'content',
        'Test page',
      )
      expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
        'content',
        'Test description',
      )
    })
  })

  it('uses businessDescription from tenant config as meta description fallback', async () => {
    const { useOptionalTenantConfig } = await import('../../core/tenant/TenantContext')
    vi.mocked(useOptionalTenantConfig).mockReturnValueOnce({
      tenantId: 'demo',
      businessName: 'Demo',
      themeName: 'clasico',
      pageType: 'landing',
      sector: 'generico',
      locale: 'es',
      businessDescription: 'Descripción del negocio para SEO',
    })

    render(
      <HelmetProvider>
        <SharedSeo title="Test page" />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
        'content',
        'Descripción del negocio para SEO',
      )
    })
  })

  it('prefers explicit description over businessDescription from tenant config', async () => {
    const { useOptionalTenantConfig } = await import('../../core/tenant/TenantContext')
    vi.mocked(useOptionalTenantConfig).mockReturnValueOnce({
      tenantId: 'demo',
      businessName: 'Demo',
      themeName: 'clasico',
      pageType: 'landing',
      sector: 'generico',
      locale: 'es',
      businessDescription: 'Tenant fallback description',
    })

    render(
      <HelmetProvider>
        <SharedSeo title="Test page" description="Explicit description" />
      </HelmetProvider>,
    )

    await waitFor(() => {
      expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
        'content',
        'Explicit description',
      )
    })
  })
})
