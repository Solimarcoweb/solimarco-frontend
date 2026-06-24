import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProductCatalog } from './ProductCatalog'
import type { ProductItem } from '../../models/product'

const products: ProductItem[] = [
  {
    id: 'cemento-cem-ii-25',
    name: 'Cemento gris CEM II 25 kg',
    description: 'Cemento de uso general. Saco de 25 kg.',
    price: 8.45,
    unit: 'saco',
    category: 'Cemento y áridos',
  },
  {
    id: 'pintura-plastica-blanca-15',
    name: 'Pintura plástica blanca mate 15 L',
    description: 'Pintura interior lavable, acabado mate.',
    price: 34.5,
    unit: 'cubo',
    category: 'Pinturas y barnices',
  },
]

describe('ProductCatalog', () => {
  it('renders every product grouped by category', () => {
    render(<ProductCatalog products={products} onAddToCart={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Cemento y áridos' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pinturas y barnices' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cemento gris CEM II 25 kg' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Pintura plástica blanca mate 15 L' }),
    ).toBeInTheDocument()
  })

  it('calls onAddToCart with the product when its button is clicked', () => {
    const onAddToCart = vi.fn()
    render(<ProductCatalog products={products} onAddToCart={onAddToCart} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Añadir Cemento gris CEM II 25 kg al carrito' }),
    )

    expect(onAddToCart).toHaveBeenCalledTimes(1)
    expect(onAddToCart).toHaveBeenCalledWith(products[0])
  })
})
