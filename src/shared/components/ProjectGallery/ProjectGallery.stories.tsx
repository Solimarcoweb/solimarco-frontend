import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectGallery, type ProjectItem } from './ProjectGallery'

const meta = {
  title: 'Shared/ProjectGallery',
  component: ProjectGallery,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ProjectGallery>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Realistic content for the construction/reform pilot sector (BM Construcción
 * S.L., Tenerife). Copy and durations are organic, not round-perfect.
 * Images are deterministic fixtures; in production they come from the backend.
 */
const projects: ProjectItem[] = [
  {
    id: 'reforma-bano-la-laguna',
    category: 'Reforma de baño',
    title: 'Baño completo en La Laguna',
    description:
      'Sustitución de bañera por plato de ducha extraplano, alicatado porcelánico de gran formato y mobiliario suspendido. Tres semanas de obra.',
    imageUrl: 'https://picsum.photos/seed/bano-la-laguna/800/600',
  },
  {
    id: 'cocina-santa-cruz',
    category: 'Reforma de cocina',
    title: 'Cocina abierta en Santa Cruz',
    description:
      'Apertura del tabique al salón, encimera de cuarzo compacto e iluminación lineal LED bajo los muebles altos.',
    imageUrl: 'https://picsum.photos/seed/cocina-santa-cruz/800/600',
  },
  {
    id: 'obra-nueva-adeje',
    category: 'Obra nueva',
    title: 'Vivienda unifamiliar en Adeje',
    description:
      'Construcción llave en mano de 180 m² en dos plantas, con porche cubierto y piscina desbordante orientada al sur.',
    imageUrl: 'https://picsum.photos/seed/obra-nueva-adeje/800/600',
  },
  {
    id: 'reforma-integral-puerto-cruz',
    category: 'Reforma integral',
    title: 'Piso reformado en Puerto de la Cruz',
    description:
      'Reforma completa de 95 m²: instalaciones de fontanería y electricidad nuevas, suelo SPC y carpintería de aluminio con rotura de puente térmico.',
    imageUrl: 'https://picsum.photos/seed/reforma-puerto-cruz/800/600',
  },
]

export const Default: Story = {
  args: {
    items: projects,
  },
}
