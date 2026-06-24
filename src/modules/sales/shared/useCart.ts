import { useState } from 'react'
import type { CartItem, ProductItem } from '../models/product'

/**
 * Manages shopping cart state: add, update quantity and remove items.
 * Designed to be instantiated at a layout or page level and passed down to
 * ProductCatalog (via onAddToCart) and Cart (via items / onUpdateQuantity / onRemove).
 *
 * @returns Cart items array and the three mutating handlers.
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  function addToCart(product: ProductItem) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return { items, addToCart, updateQuantity, removeItem }
}
