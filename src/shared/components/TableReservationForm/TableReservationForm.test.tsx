import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../../../test-utils'
import { TableReservationForm } from './TableReservationForm'

/** Returns a `yyyy-mm-dd` date `days` in the future. */
function futureDate(days = 7): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)
}

function fillRequired(date: string) {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'María Pérez' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'maria@example.com' } })
  fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '600123456' } })
  fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: date } })
  fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '21:00' } })
  // guests defaults to 2
}

describe('TableReservationForm', () => {
  it('renders the reservation form', () => {
    renderWithI18n(<TableReservationForm tenantId="demo-el-drago" />)

    expect(screen.getByRole('button', { name: 'Reservar mesa' })).toBeInTheDocument()
  })

  it('rejects a past date and does not submit', () => {
    const onSubmit = vi.fn()
    renderWithI18n(<TableReservationForm tenantId="demo-el-drago" onSubmit={onSubmit} />)

    fillRequired('2020-01-01')
    fireEvent.click(screen.getByRole('button', { name: 'Reservar mesa' }))

    expect(screen.getByText('La fecha no puede ser pasada.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects an out-of-range guest count', () => {
    const onSubmit = vi.fn()
    renderWithI18n(<TableReservationForm tenantId="demo-el-drago" onSubmit={onSubmit} />)

    fillRequired(futureDate())
    fireEvent.change(screen.getByLabelText('Comensales'), { target: { value: '25' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reservar mesa' }))

    expect(screen.getByText(/entre 1 y 20 comensales/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid data and shows the confirmation', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderWithI18n(<TableReservationForm tenantId="demo-el-drago" onSubmit={onSubmit} />)

    fillRequired(futureDate())
    fireEvent.click(screen.getByRole('button', { name: 'Reservar mesa' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'María Pérez', guests: 2, date: futureDate() }),
    )
    expect(await screen.findByRole('status')).toHaveTextContent(/reserva solicitada/i)
  })
})
