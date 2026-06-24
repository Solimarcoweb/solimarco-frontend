/** A product offered in the materials shop. */
export interface ProductItem {
  id: string
  name: string
  description: string
  /** Unit price, in euros. */
  price: number
  /** Selling unit label, e.g. "saco 25 kg", "litro", "ud". */
  unit: string
  imageUrl?: string
  category: string
  /** Available stock, when tracked by the tenant. */
  stock?: number
}

/** A product placed in the cart, with the chosen quantity. */
export interface CartItem extends ProductItem {
  quantity: number
}

/** Payload submitted to the backend when placing an order. */
export interface OrderData {
  tenantId: string
  items: CartItem[]
  customerName: string
  customerEmail: string
  customerPhone: string
}

/** Lifecycle of the order submission. */
export type OrderState = 'idle' | 'submitting' | 'success' | 'error'
