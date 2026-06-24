import type { Meta, StoryObj } from '@storybook/react-vite'
import { TreatmentsList } from './TreatmentsList'
import type { Treatment } from './TreatmentsList'

const TREATMENTS: Treatment[] = [
  {
    id: 'hidratacion-facial',
    name: 'Hidratación facial profunda',
    description:
      'Tratamiento intensivo con ácido hialurónico, vitamina C y extracto de rosa mosqueta. Devuelve la luminosidad y calma pieles sensibilizadas.',
    price: 'desde 55 €',
    duration: '60 min',
    category: 'Tratamientos faciales',
    imageUrl: 'https://picsum.photos/seed/facial-hydration/800/600',
  },
  {
    id: 'lifting-contorno',
    name: 'Lifting de contorno',
    description: 'Reafirmante de mandíbula y cuello con radiofrecuencia monopolar y masaje drenante.',
    price: '80 €',
    duration: '75 min',
    category: 'Tratamientos faciales',
  },
  {
    id: 'peeling-quimico',
    name: 'Peeling químico suave',
    description: 'Exfoliación con ácido láctico al 30 % para renovar la textura de la piel.',
    price: '65 €',
    duration: '45 min',
    category: 'Tratamientos faciales',
  },
  {
    id: 'drenaje-linfatico',
    name: 'Drenaje linfático corporal',
    description: 'Técnica manual Vodder para mejorar la circulación y reducir la retención de líquidos.',
    price: 'desde 50 €',
    duration: '60 min',
    category: 'Tratamientos corporales',
    imageUrl: 'https://picsum.photos/seed/drenaje/800/600',
  },
  {
    id: 'envolturas',
    name: 'Envoltura de algas marinas',
    description: 'Remineralización con algas atlánticas, efecto reafirmante y detoxificante.',
    price: '60 €',
    duration: '50 min',
    category: 'Tratamientos corporales',
  },
  {
    id: 'manicura-clasica',
    name: 'Manicura clásica',
    description: 'Limado, cutículas y esmaltado de larga duración.',
    price: '22 €',
    duration: '45 min',
    category: 'Manicura y pedicura',
    imageUrl: 'https://picsum.photos/seed/manicura/800/600',
  },
  {
    id: 'pedicura-spa',
    name: 'Pedicura spa',
    description: 'Baño de pies, exfoliación, hidratación y esmaltado.',
    price: '35 €',
    duration: '60 min',
    category: 'Manicura y pedicura',
  },
]

const meta = {
  title: 'Shared/TreatmentsList',
  component: TreatmentsList,
  args: {
    treatments: TREATMENTS,
  },
} satisfies Meta<typeof TreatmentsList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomHeading: Story = {
  args: {
    heading: 'Nuestros tratamientos',
  },
}

export const WithoutImages: Story = {
  args: {
    treatments: TREATMENTS.map(({ imageUrl: _img, ...rest }) => rest),
  },
}

export const SingleCategory: Story = {
  args: {
    treatments: TREATMENTS.filter((t) => t.category === 'Tratamientos faciales'),
  },
}
