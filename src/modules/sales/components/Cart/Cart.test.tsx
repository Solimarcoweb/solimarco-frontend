import { type ComponentProps } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Cart } from './Cart'
import type { CartItem } from '../../models/product'
import { formatPrice } from '../../shared/formatPrice'

const items: CartItem[] = [
  {
    id: 'cemento-cem-ii-25',
    name: 'Cemento gris CEM II 25 kg',
    description: 'Cemento de uso general. Saco de 25 kg.',
    price: 8.45,
    unit: 'saco',
    category: 'Cemento y áridos',
    quantity: 10,
  },
  {
    id: 'pintura-plastica-blanca-15',
    name: 'Pintura plástica blanca mate 15 L',
    description: 'Pintura interior lavable, acabado mate.',
    price: 34.5,
    unit: 'cubo',
    category: 'Pinturas y barnices',
    quantity: 2,
  },
]

function renderCart(overrides: Partial<ComponentProps<typeof Cart>> = {}) {
  return render(
    <Cart
      items={items}
      tenantId="bm-construccion"
      onUpdateQuantity={vi.fn()}
      onRemove={vi.fn()}
      {...overrides}
    />,
  )
}

describe('Cart', () => {
  it('computes the total from item prices and quantities', () => {
    // 8.45 * 10 + 34.5 * 2 = 153.5
    renderCart()

    // Intl currency formatting uses a non-breaking space that Testing Library
    // normalizes to a regular space when matching, so normalize it here too.
    const expectedTotal = formatPrice(153.5).replace(/\s/g, ' ')
    expect(screen.getByText(expectedTotal)).toBeInTheDocument()
  })

  it('blocks checkout and shows errors when customer fields are empty', () => {
    const onSubmit = vi.fn()
    renderCart({ onSubmit })

    fireEvent.click(screen.getByRole('button', { name: 'Finalizar pedido' }))

    expect(screen.getByText('Indica tu nombre.')).toBeInTheDocument()
    expect(screen.getByText('Indica tu email.')).toBeInTheDocument()
    expect(screen.getByText('Indica un teléfono de contacto.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the order with the cart and customer data when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ id: 'order-1', status: 'pendiente' })
    renderCart({ onSubmit })

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'María Hernández' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'maria@example.com' } })
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '600123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar pedido' }))

    // Cart hands the service the UI-shaped order; the tenant slug is applied by
    // the sales service, not carried in the order object.
    expect(onSubmit).toHaveBeenCalledWith({
      items,
      customerName: 'María Hernández',
      customerEmail: 'maria@example.com',
      customerPhone: '600123456',
    })
    expect(await screen.findByText(/pedido realizado/i)).toBeInTheDocument()
  })

  it('shows an empty state when there are no items', () => {
    renderCart({ items: [] })

    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
  })
})
