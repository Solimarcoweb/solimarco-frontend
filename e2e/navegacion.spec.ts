import { expect, test } from '@playwright/test'
import { BASE, mockTenant } from './support'

test.describe('Navigation', () => {
  test('the language selector switches the UI language', async ({ page }) => {
    await mockTenant(page)
    await page.goto(`${BASE}/`)

    // Spanish by default: the budget submit button is in Spanish.
    await expect(page.getByRole('button', { name: 'Solicitar presupuesto' })).toBeVisible()

    await page.getByRole('button', { name: 'EN' }).click()

    // After switching to English the translated strings update.
    await expect(page.getByRole('button', { name: 'Request a quote' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Solicitar presupuesto' })).toHaveCount(0)
  })

  test('the hero CTA scrolls down to the budget form', async ({ page }) => {
    await mockTenant(page)
    await page.goto(`${BASE}/`)

    const heading = page.getByRole('heading', { name: 'Solicita tu presupuesto' })
    await expect(heading).not.toBeInViewport()

    await page.getByRole('link', { name: 'Solicitar presupuesto' }).click()

    await expect(heading).toBeInViewport()
  })
})
