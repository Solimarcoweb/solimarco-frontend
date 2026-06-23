import { expect, test } from '@playwright/test'

test('homepage renders the main heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /inicio/i })).toBeVisible()
})
