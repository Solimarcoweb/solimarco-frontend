import type { Page } from '@playwright/test'

/**
 * Tenant subdomain used by the E2E flows. Chromium resolves `*.localhost` to
 * the loopback dev server, and the app derives the tenant slug from this host.
 */
export const BASE = 'http://bm-construccion.localhost:5173'

/** Helper to fulfill a request with a JSON body. */
function json(body: unknown) {
  return { status: 200, contentType: 'application/json', body: JSON.stringify(body) }
}

/**
 * Stubs the backend calls every construction page makes on load, so the tests
 * run without a real backend: the tenant config (otherwise `TenantProvider`
 * shows its error screen), the per-tenant content endpoints (services /
 * projects / hours) and the best-effort page-view tracking beacon.
 *
 * @param page - Playwright page to install the routes on.
 * @param sector - Tenant sector that decides which page TenantRouter renders.
 */
export async function mockTenant(page: Page, sector = 'construccion'): Promise<void> {
  await page.route('**/api/tenants/**/config', (route) =>
    route.fulfill(
      json({
        tenantId: 'bm-construccion',
        businessName: 'BM Construcción S.L.',
        themeName: 'clasico',
        siteType: 'LANDING',
        sector,
        locale: 'es',
        businessDescription: 'Más de 25 años de obra nueva y reformas integrales en Tenerife.',
        phone: '+34 922 65 41 30',
        email: 'info@bmconstruccionsl.com',
        address: 'Calle La Hornera 48, La Laguna, Tenerife',
        modules: { hasShop: false, hasReservations: false, hasCitas: false, hasBudgetForm: true },
      }),
    ),
  )

  await page.route('**/api/tenants/**/services', (route) =>
    route.fulfill(
      json([
        {
          id: 'reforma-integral',
          name: 'Reformas integrales',
          description: 'Llave en mano.',
          imageUrl: 'https://picsum.photos/seed/reforma/800/600',
          displayOrder: 1,
        },
        {
          id: 'obra-nueva',
          name: 'Obra nueva',
          description: 'Construcción desde cero.',
          imageUrl: 'https://picsum.photos/seed/obra/800/600',
          displayOrder: 2,
        },
      ]),
    ),
  )

  await page.route('**/api/tenants/**/projects', (route) =>
    route.fulfill(
      json([
        {
          id: 'bano-la-laguna',
          name: 'Baño en La Laguna',
          description: 'Reforma completa de baño.',
          imageUrl: 'https://picsum.photos/seed/bano/800/600',
          category: 'Reforma de baño',
          displayOrder: 1,
        },
      ]),
    ),
  )

  await page.route('**/api/tenants/**/hours', (route) =>
    route.fulfill(
      json({
        weekly: [
          {
            dayOfWeek: 'MONDAY',
            closed: false,
            morningOpen: '08:00',
            morningClose: '13:00',
            afternoonOpen: '16:00',
            afternoonClose: '18:00',
          },
        ],
        upcomingExceptions: [],
      }),
    ),
  )

  // Page-view tracking is best-effort; stub it so no real request is attempted.
  await page.route('**/api/track', (route) => route.fulfill({ status: 204, body: '' }))
}
