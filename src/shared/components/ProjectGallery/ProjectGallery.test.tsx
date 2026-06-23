import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectGallery, type ProjectItem } from './ProjectGallery'

const items: ProjectItem[] = [
  {
    id: 'reforma-bano-la-laguna',
    category: 'Reforma de baño',
    title: 'Baño completo en La Laguna',
    description: 'Sustitución de bañera por plato de ducha y alicatado porcelánico.',
    imageUrl: 'https://picsum.photos/seed/bano-la-laguna/800/600',
  },
  {
    id: 'cocina-santa-cruz',
    category: 'Reforma de cocina',
    title: 'Cocina abierta en Santa Cruz',
    description: 'Apertura del tabique al salón y encimera de cuarzo compacto.',
    imageUrl: 'https://picsum.photos/seed/cocina-santa-cruz/800/600',
  },
  {
    id: 'obra-nueva-adeje',
    category: 'Obra nueva',
    title: 'Vivienda unifamiliar en Adeje',
    description: 'Construcción llave en mano de 180 m² en dos plantas.',
    imageUrl: 'https://picsum.photos/seed/obra-nueva-adeje/800/600',
  },
  {
    id: 'reforma-integral-puerto-cruz',
    category: 'Reforma integral',
    title: 'Piso reformado en Puerto de la Cruz',
    description: 'Reforma completa de 95 m² con instalaciones nuevas.',
    imageUrl: 'https://picsum.photos/seed/reforma-puerto-cruz/800/600',
  },
]

describe('ProjectGallery', () => {
  it('renders every project item', () => {
    render(<ProjectGallery items={items} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(items.length)
  })

  it('shows each project title as a heading', () => {
    render(<ProjectGallery items={items} />)

    for (const item of items) {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument()
    }
  })
})
