import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ServicesList } from './ServicesList'
import type { Service } from './ServicesList'

const SERVICES: Service[] = [
  {
    id: 'cambio-aceite',
    name: 'Cambio de aceite y filtros',
    description: 'Aceite sintético y filtro de aceite, aire y habitáculo.',
    price: 'desde 49 €',
    duration: '~45 min',
  },
  {
    id: 'frenos',
    name: 'Frenos y suspensión',
    description: 'Revisión y sustitución de pastillas, discos y amortiguadores.',
    price: 'desde 79 €',
    duration: '~90 min',
  },
  {
    id: 'itv',
    name: 'Pre-revisión ITV',
    description: 'Comprobación completa antes de pasar la ITV.',
    price: '29 €',
    duration: '~30 min',
  },
]

describe('ServicesList', () => {
  it('renders all services', () => {
    render(<ServicesList services={SERVICES} />)

    expect(screen.getByText('Cambio de aceite y filtros')).toBeInTheDocument()
    expect(screen.getByText('Frenos y suspensión')).toBeInTheDocument()
    expect(screen.getByText('Pre-revisión ITV')).toBeInTheDocument()
  })

  it('renders the default section heading', () => {
    render(<ServicesList services={SERVICES} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Nuestros servicios' })).toBeInTheDocument()
  })

  it('accepts a custom heading', () => {
    render(<ServicesList services={SERVICES} heading="Servicios del taller" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Servicios del taller' })).toBeInTheDocument()
  })

  it('renders prices and durations', () => {
    render(<ServicesList services={SERVICES} />)

    expect(screen.getByText('desde 49 €')).toBeInTheDocument()
    expect(screen.getByText('~45 min')).toBeInTheDocument()
  })

  it('renders with a single service (no secondary grid)', () => {
    render(<ServicesList services={[SERVICES[0]]} />)

    expect(screen.getByText('Cambio de aceite y filtros')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
