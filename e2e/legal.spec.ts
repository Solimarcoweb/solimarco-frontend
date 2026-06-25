import { expect, test } from '@playwright/test'
import { BASE, mockTenant } from './support'

test.describe('Legal pages', () => {
  test('renders sanitized legal content and never injects scripts', async ({ page }) => {
    await mockTenant(page)

    // /legal/privacidad maps to the POLITICA_PRIVACIDAD type for this tenant.
    let requestedUrl = ''
    await page.route('**/api/legal/**', (route) => {
      requestedUrl = route.request().url()
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'legal-1',
          tenantId: 'bm-construccion',
          type: 'POLITICA_PRIVACIDAD',
          content:
            '<h2>Responsable</h2><p>BM Construcción S.L.</p>' +
            '<script>window.__pwned = true</script>' +
            '<a href="https://example.com" onclick="evil()">Más información</a>',
          version: 1,
          publishedAt: '2026-03-14T09:00:00Z',
          active: true,
        }),
      })
    })

    await page.goto(`${BASE}/legal/privacidad`)

    // Title is derived from the legal type; sanitized body is rendered.
    await expect(page.getByRole('heading', { level: 1, name: 'Política de privacidad' })).toBeVisible()
    await expect(page.getByText('BM Construcción S.L.')).toBeVisible()

    // The slug was resolved to the enum type and tenant slug in the request.
    expect(requestedUrl).toContain('/api/legal/bm-construccion/POLITICA_PRIVACIDAD')

    // DOMPurify stripped the <script> (never executed, not present in the DOM).
    expect(await page.evaluate(() => (window as unknown as { __pwned?: boolean }).__pwned)).toBeFalsy()
    await expect(page.locator('main script')).toHaveCount(0)

    // Whitelisted link kept its href, but the onclick handler was stripped.
    const link = page.getByRole('link', { name: 'Más información' })
    await expect(link).toHaveAttribute('href', 'https://example.com')
    expect(await link.getAttribute('onclick')).toBeNull()
  })

  test('shows a 404 for an unknown legal slug', async ({ page }) => {
    await mockTenant(page)
    await page.goto(`${BASE}/legal/no-existe`)

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  })
})
