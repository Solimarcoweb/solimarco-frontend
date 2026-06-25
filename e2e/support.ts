import type { Page } from '@playwright/test'

/**
 * Tenant subdomain used by the E2E flows. Chromium resolves `*.localhost` to
 * the loopback dev server, and the app derives the tenant slug from this host.
 */
export const BASE = 'http://bm-construccion.localhost:5173'

/**
 * Stubs the backend calls every page makes on load, so the tests run without a
 * real backend: the tenant config (otherwise `TenantProvider` shows its error
 * screen) and the best-effort page-view tracking beacon.
 *
 * @param page - Playwright page to install the routes on.
 * @param sector - Tenant sector that decides which page TenantRouter renders.
 */
export async function mockTenant(page: Page, sector = 'construccion'): Promise<void> {
  await page.route('**/api/tenants/**/config', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        tenantId: 'bm-construccion',
        businessName: 'BM Construcción S.L.',
        themeName: 'clasico',
        pageType: 'landing',
        sector,
        locale: 'es',
      }),
    }),
  )

  // Page-view tracking is best-effort; stub it so no real request is attempted.
  await page.route('**/api/track', (route) => route.fulfill({ status: 204, body: '' }))
}
