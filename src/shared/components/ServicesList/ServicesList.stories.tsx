import type { Meta, StoryObj } from '@storybook/react-vite'
import { ServicesList } from './ServicesList'
import type { Service } from './ServicesList'

const SERVICES: Service[] = [
  {
    id: 'cambio-aceite',
    name: 'Cambio de aceite y filtros',
    description: 'Aceite sintético 5W-30 con filtro de aceite, aire y habitáculo incluidos. Revisión de 17 puntos sin coste adicional.',
    price: 'desde 49 €',
    duration: '~45 min',
    imageUrl: 'https://picsum.photos/seed/cambio-aceite/800/600',
  },
  {
    id: 'frenos',
    name: 'Frenos y suspensión',
    description: 'Revisión y sustitución de pastillas, discos, latiguillos y amortiguadores.',
    price: 'desde 79 €',
    duration: '~90 min',
    imageUrl: 'https://picsum.photos/seed/frenos-taller/800/600',
  },
  {
    id: 'itv',
    name: 'Pre-revisión ITV',
    description: 'Comprobación completa del vehículo antes de pasar la ITV oficial.',
    price: '29 €',
    duration: '~30 min',
    imageUrl: 'https://picsum.photos/seed/itv-taller/800/600',
  },
  {
    id: 'electricidad',
    name: 'Electricidad y electrónica',
    description: 'Diagnóstico OBD, reparación de averías eléctricas y sustitución de batería.',
    price: 'desde 35 €',
    duration: '~60 min',
    imageUrl: 'https://picsum.photos/seed/electricidad-auto/800/600',
  },
  {
    id: 'neumaticos',
    name: 'Neumáticos y llantas',
    description: 'Montaje, equilibrado y alineación de neumáticos de todas las marcas.',
    price: 'desde 12 €/ud',
    duration: '~30 min',
    imageUrl: 'https://picsum.photos/seed/neumaticos/800/600',
  },
]

const meta = {
  title: 'Shared/ServicesList',
  component: ServicesList,
  args: {
    services: SERVICES,
  },
} satisfies Meta<typeof ServicesList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomHeading: Story = {
  args: {
    heading: 'Lo que hacemos',
  },
}

export const WithoutImages: Story = {
  args: {
    services: SERVICES.map(({ imageUrl: _imageUrl, ...rest }) => rest),
  },
}

export const SingleService: Story = {
  args: {
    services: [SERVICES[0]],
  },
}
