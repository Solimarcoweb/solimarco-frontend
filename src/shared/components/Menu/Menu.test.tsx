import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Menu, type MenuCategory } from './Menu'

const categories: MenuCategory[] = [
  {
    id: 'tartas',
    name: 'Tartas',
    items: [
      {
        id: 'tarta-queso',
        name: 'Tarta de queso al horno',
        description: 'Cremosa por dentro, caramelizada por fuera.',
        price: 4.2,
        allergens: ['lactosa', 'huevo'],
      },
    ],
  },
  {
    id: 'cafes',
    name: 'Cafés e infusiones',
    items: [
      {
        id: 'barraquito',
        name: 'Barraquito',
        description: 'Café, leche condensada, licor 43, limón y canela.',
        price: 2.3,
      },
    ],
  },
]

describe('Menu', () => {
  it('renders a heading for every category', () => {
    render(<Menu categories={categories} />)

    expect(screen.getByRole('heading', { name: 'Tartas' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cafés e infusiones' })).toBeInTheDocument()
  })

  it('renders the items with their formatted price', () => {
    render(<Menu categories={categories} />)

    expect(screen.getByRole('heading', { name: 'Tarta de queso al horno' })).toBeInTheDocument()
    expect(screen.getByText('4,20 €')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Barraquito' })).toBeInTheDocument()
  })

  it('exposes a category navigation linking to each section', () => {
    render(<Menu categories={categories} />)

    const nav = screen.getByRole('navigation', { name: /categorías de la carta/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tartas' })).toHaveAttribute('href', '#menu-cat-tartas')
  })

  it('lists the allergens of an item', () => {
    render(<Menu categories={categories} />)

    const allergens = screen.getByRole('list', { name: 'Alérgenos' })
    expect(allergens).toHaveTextContent('lactosa')
    expect(allergens).toHaveTextContent('huevo')
  })
})
