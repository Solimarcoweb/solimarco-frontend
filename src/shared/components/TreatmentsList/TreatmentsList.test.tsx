import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TreatmentsList } from './TreatmentsList'
import type { Treatment } from './TreatmentsList'

const TREATMENTS: Treatment[] = [
  {
    id: 'hidratacion-facial',
    name: 'Hidratación facial profunda',
    description: 'Tratamiento nutritivo con ácido hialurónico y vitamina C.',
    price: 'desde 55 €',
    duration: '60 min',
    category: 'Tratamientos faciales',
    imageUrl: 'https://picsum.photos/seed/facial/600/450',
  },
  {
    id: 'lifting-contorno',
    name: 'Lifting de contorno',
    description: 'Reafirmante de mandíbula y cuello con radiofrecuencia.',
    price: '80 €',
    duration: '75 min',
    category: 'Tratamientos faciales',
  },
  {
    id: 'manicura-clasica',
    name: 'Manicura clásica',
    description: 'Limado, cutículas y esmaltado de larga duración.',
    price: '22 €',
    duration: '45 min',
    category: 'Manicura y pedicura',
  },
]

describe('TreatmentsList', () => {
  it('renders all treatments', () => {
    render(<TreatmentsList treatments={TREATMENTS} />)

    expect(screen.getByText('Hidratación facial profunda')).toBeInTheDocument()
    expect(screen.getByText('Lifting de contorno')).toBeInTheDocument()
    expect(screen.getByText('Manicura clásica')).toBeInTheDocument()
  })

  it('renders the default section heading', () => {
    render(<TreatmentsList treatments={TREATMENTS} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Tratamientos' })).toBeInTheDocument()
  })

  it('accepts a custom heading', () => {
    render(<TreatmentsList treatments={TREATMENTS} heading="Nuestros tratamientos" />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Nuestros tratamientos' }),
    ).toBeInTheDocument()
  })

  it('renders category headings', () => {
    render(<TreatmentsList treatments={TREATMENTS} />)

    expect(screen.getByText('Tratamientos faciales')).toBeInTheDocument()
    expect(screen.getByText('Manicura y pedicura')).toBeInTheDocument()
  })

  it('renders prices and durations', () => {
    render(<TreatmentsList treatments={TREATMENTS} />)

    expect(screen.getByText('desde 55 €')).toBeInTheDocument()
    expect(screen.getAllByText('60 min').length).toBeGreaterThan(0)
  })
})
