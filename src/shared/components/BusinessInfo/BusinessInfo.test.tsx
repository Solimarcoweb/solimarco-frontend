import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BusinessInfo, type BusinessHours } from './BusinessInfo'

const hours: BusinessHours[] = [
  { day: 'Lunes', open: '', close: '', closed: true },
  { day: 'Martes', open: '08:30', close: '20:00' },
  { day: 'Domingo', open: '09:00', close: '14:00' },
]

const baseProps = {
  address: 'Calle del Castillo 32, 38002 Santa Cruz de Tenerife',
  phone: '+34 922 24 18 60',
  email: 'hola@pasterialaisla.es',
  hours,
}

describe('BusinessInfo', () => {
  it('renders a row for every day with its hours', () => {
    render(<BusinessInfo {...baseProps} />)

    expect(screen.getByText('Martes')).toBeInTheDocument()
    expect(screen.getByText('08:30')).toBeInTheDocument()
    expect(screen.getByText('20:00')).toBeInTheDocument()
  })

  it('marks closed days as "Cerrado"', () => {
    render(<BusinessInfo {...baseProps} />)

    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })

  it('renders the contact details with a tel link', () => {
    render(<BusinessInfo {...baseProps} />)

    expect(screen.getByRole('link', { name: '+34 922 24 18 60' })).toHaveAttribute(
      'href',
      'tel:+34922241860',
    )
  })

  it('renders the static map when a map image is provided', () => {
    render(<BusinessInfo {...baseProps} mapImageUrl="https://example.com/map.png" />)

    expect(screen.getByRole('img', { name: /mapa de la ubicación/i })).toHaveAttribute(
      'loading',
      'lazy',
    )
  })
})
