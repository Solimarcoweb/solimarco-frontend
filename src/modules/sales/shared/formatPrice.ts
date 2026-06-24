const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

/**
 * Formats a numeric amount as a euro price string (Spanish locale),
 * e.g. `8.45` → `"8,45 €"`. Shared by the catalog and the cart so the
 * formatting stays consistent across the sales module.
 *
 * @param amount - Amount in euros.
 * @returns The localized currency string.
 */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount)
}
