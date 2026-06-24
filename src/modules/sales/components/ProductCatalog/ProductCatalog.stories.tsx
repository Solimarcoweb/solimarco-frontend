import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ProductCatalog } from './ProductCatalog'
import type { ProductItem } from '../../models/product'

const meta = {
  title: 'Sales/ProductCatalog',
  component: ProductCatalog,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onAddToCart: fn(),
  },
} satisfies Meta<typeof ProductCatalog>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Realistic materials catalog for the construction/reform pilot sector
 * (Tenerife). Prices are organic; images are deterministic fixtures.
 */
const products: ProductItem[] = [
  {
    id: 'cemento-cem-ii-25',
    name: 'Cemento gris CEM II 25 kg',
    description: 'Cemento de uso general para morteros y hormigones. Saco de 25 kg.',
    price: 8.45,
    unit: 'saco',
    category: 'Cemento y áridos',
    imageUrl: 'https://picsum.photos/seed/cemento-cem-ii/800/600',
    stock: 120,
  },
  {
    id: 'arena-lavada-big-bag',
    name: 'Arena de río lavada',
    description: 'Árido fino lavado para enfoscados y soleras. Big bag de 1 m³.',
    price: 48,
    unit: 'big bag 1 m³',
    category: 'Cemento y áridos',
    imageUrl: 'https://picsum.photos/seed/arena-lavada/800/600',
    stock: 18,
  },
  {
    id: 'mortero-cola-flexible-25',
    name: 'Mortero cola flexible C2 25 kg',
    description: 'Adhesivo cementoso flexible para gres porcelánico y gran formato.',
    price: 12.9,
    unit: 'saco',
    category: 'Cemento y áridos',
    imageUrl: 'https://picsum.photos/seed/mortero-cola/800/600',
    stock: 4,
  },
  {
    id: 'pintura-plastica-blanca-15',
    name: 'Pintura plástica blanca mate 15 L',
    description: 'Pintura interior lavable de alto rendimiento, acabado mate. Cubo de 15 L.',
    price: 34.5,
    unit: 'cubo',
    category: 'Pinturas y barnices',
    imageUrl: 'https://picsum.photos/seed/pintura-blanca/800/600',
    stock: 32,
  },
  {
    id: 'esmalte-sintetico-750',
    name: 'Esmalte sintético satinado 750 ml',
    description: 'Esmalte para madera y metal, secado rápido. Bote de 750 ml.',
    price: 11.2,
    unit: 'bote',
    category: 'Pinturas y barnices',
    imageUrl: 'https://picsum.photos/seed/esmalte-sintetico/800/600',
    stock: 27,
  },
  {
    id: 'taladro-percutor-750w',
    name: 'Taladro percutor 750 W',
    description: 'Taladro con percusión y velocidad variable, maletín y brocas incluidas.',
    price: 64.9,
    unit: 'ud',
    category: 'Herramienta',
    imageUrl: 'https://picsum.photos/seed/taladro-percutor/800/600',
    stock: 9,
  },
  {
    id: 'juego-brocas-widia-5',
    name: 'Juego de brocas widia 5 uds',
    description: 'Brocas para hormigón y piedra de 5 a 10 mm. Estuche de 5 unidades.',
    price: 9.75,
    unit: 'set',
    category: 'Herramienta',
    imageUrl: 'https://picsum.photos/seed/brocas-widia/800/600',
    stock: 3,
  },
]

export const Default: Story = {
  args: {
    products,
  },
}
