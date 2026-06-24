import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu, type MenuCategory } from './Menu'

const meta = {
  title: 'Shared/Menu',
  component: Menu,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Menu>

export default meta

type Story = StoryObj<typeof meta>

/** Realistic carta for the restaurant landing demo (Pastelería La Isla). */
const categories: MenuCategory[] = [
  {
    id: 'tartas',
    name: 'Tartas',
    items: [
      {
        id: 'tarta-zanahoria',
        name: 'Tarta de zanahoria',
        description: 'Bizcocho especiado con nueces y frosting de queso crema.',
        price: 3.8,
        imageUrl: 'https://picsum.photos/seed/tarta-zanahoria/600/450',
        allergens: ['gluten', 'lactosa', 'frutos secos', 'huevo'],
      },
      {
        id: 'tarta-queso',
        name: 'Tarta de queso al horno',
        description: 'Receta vasca, cremosa por dentro y caramelizada por fuera.',
        price: 4.2,
        imageUrl: 'https://picsum.photos/seed/tarta-queso/600/450',
        allergens: ['lactosa', 'huevo'],
      },
    ],
  },
  {
    id: 'bolleria',
    name: 'Bollería',
    items: [
      {
        id: 'croissant',
        name: 'Croissant de mantequilla',
        description: 'Hojaldre artesano fermentado 24 horas.',
        price: 1.6,
        imageUrl: 'https://picsum.photos/seed/croissant/600/450',
        allergens: ['gluten', 'lactosa'],
      },
      {
        id: 'napolitana',
        name: 'Napolitana de chocolate',
        description: 'Rellena de chocolate negro 55%.',
        price: 1.9,
        imageUrl: 'https://picsum.photos/seed/napolitana/600/450',
        allergens: ['gluten', 'lactosa', 'soja'],
      },
    ],
  },
  {
    id: 'cafes',
    name: 'Cafés e infusiones',
    items: [
      {
        id: 'cortado',
        name: 'Cortado leche y leche',
        description: 'Especialidad canaria con leche condensada y café.',
        price: 1.4,
      },
      {
        id: 'barraquito',
        name: 'Barraquito',
        description: 'Café, leche condensada, licor 43, limón y canela.',
        price: 2.3,
        allergens: ['lactosa'],
      },
    ],
  },
]

export const Default: Story = {
  args: {
    categories,
  },
}
