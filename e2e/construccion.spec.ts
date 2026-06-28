import { expect, test } from '@playwright/test'
import { BASE, mockTenant } from './support'

test.describe('Construcción — budget request flow', () => {
  test('fills and submits the budget form, mapping to the API contract', async ({ page }) => {
    await mockTenant(page)

    let requestBody: unknown
    await page.route('**/api/reservations', async (route) => {
      requestBody = route.request().postDataJSON()
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'lead-1', status: 'pendiente' }),
      })
    })

    await page.goto(`${BASE}/`)

    // Hero loads with the tenant's business name as the headline.
    await expect(page.getByRole('heading', { level: 1, name: 'BM Construcción S.L.' })).toBeVisible()

    // Budget section heading exists further down the page.
    await expect(page.getByRole('heading', { name: 'Solicita tu presupuesto' })).toBeVisible()

    // Fill the form (auto-scrolls each field into view, revealing the section).
    await page.getByLabel('Nombre').fill('María Hernández')
    await page.getByLabel('Teléfono').fill('600123456')
    await page.getByLabel('Email').fill('maria@example.com')
    await page.getByLabel('Tipo de servicio').selectOption('reforma-integral')
    await page
      .getByLabel('Descripción del proyecto')
      .fill('Reforma integral de un piso de 90 m² en La Laguna.')

    await page.getByRole('button', { name: 'Solicitar presupuesto' }).click()

    // Success confirmation replaces the form.
    await expect(page.getByText('¡Solicitud enviada!')).toBeVisible()

    // The frontend mapped the form to the backend contract (tenant slug + details).
    expect(requestBody).toMatchObject({
      tenantId: 'bm-construccion',
      contactName: 'María Hernández',
      contactEmail: 'maria@example.com',
      contactPhone: '600123456',
      details: {
        serviceType: 'reforma-integral',
        description: 'Reforma integral de un piso de 90 m² en La Laguna.',
      },
    })
  })
})
