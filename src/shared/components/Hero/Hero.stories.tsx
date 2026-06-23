import type { Meta, StoryObj } from '@storybook/react-vite'
import { Hero } from './Hero'

const meta = {
  title: 'Shared/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Hero>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Default hero with realistic content for the construction/reform pilot sector
 * (BM Construcción S.L., Tenerife). Numbers are organic, not round-perfect.
 */
export const Default: Story = {
  args: {
    title: 'Reformas integrales y obra nueva en Tenerife',
    subtitle:
      'Más de 25 años transformando viviendas y locales en la isla. Showroom de materiales propio y proyecto llave en mano, de la demolición al último detalle.',
    ctaLabel: 'Solicitar presupuesto',
    ctaHref: '#contacto',
  },
}

/**
 * Same hero over a background photo, showing the overlay + light-text variant.
 */
export const WithBackgroundImage: Story = {
  args: {
    ...Default.args,
    backgroundImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
  },
}
