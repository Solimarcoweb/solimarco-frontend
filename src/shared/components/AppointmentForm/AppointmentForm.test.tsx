import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../../../test-utils'
import { RateLimitError } from '../../../core/http/apiClient'
import { AppointmentForm } from './AppointmentForm'
import type { Service } from '../ServicesList'

const SERVICES: Service[] = [
  { id: 'cambio-aceite', name: 'Cambio de aceite y filtros', description: 'Aceite y filtros.' },
  { id: 'frenos', name: 'Frenos y suspensión', description: 'Revisión de frenos.' },
]

/** Returns a `yyyy-mm-dd` date `days` in the future. */
function futureDate(days = 7): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)
}

function fillRequired(serviceId = 'cambio-aceite', date = futureDate()) {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Luis García' } })
  fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '600111222' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'luis@example.com' } })
  fireEvent.change(screen.getByLabelText('Servicio'), { target: { value: serviceId } })
  fireEvent.change(screen.getByLabelText('Fecha preferida'), { target: { value: date } })
  fireEvent.change(screen.getByLabelText('Hora preferida'), { target: { value: '10:00' } })
}

describe('AppointmentForm', () => {
  it('renders the form with required fields', () => {
    renderWithI18n(<AppointmentForm tenantId="demo-el-teide" services={SERVICES} />)

    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Servicio')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha preferida')).toBeInTheDocument()
    expect(screen.getByLabelText('Hora preferida')).toBeInTheDocument()
  })

  it('populates the service selector from props', () => {
    renderWithI18n(<AppointmentForm tenantId="demo-el-teide" services={SERVICES} />)

    expect(screen.getByRole('option', { name: 'Cambio de aceite y filtros' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Frenos y suspensión' })).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', () => {
    const onSubmit = vi.fn()
    renderWithI18n(<AppointmentForm tenantId="demo-el-teide" services={SERVICES} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Solicitar cita' }))

    expect(screen.getByText('Indica tu nombre.')).toBeInTheDocument()
    expect(screen.getByText('Indica un teléfono de contacto.')).toBeInTheDocument()
    expect(screen.getByText('Indica tu email.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona un servicio.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects an invalid email', () => {
    const onSubmit = vi.fn()
    renderWithI18n(<AppointmentForm tenantId="demo-el-teide" services={SERVICES} onSubmit={onSubmit} />)

    fillRequired()
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } })
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar cita' }))

    expect(screen.getByText('El email no tiene un formato válido.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects a past date', () => {
    const onSubmit = vi.fn()
    renderWithI18n(<AppointmentForm tenantId="demo-el-teide" services={SERVICES} onSubmit={onSubmit} />)

    fillRequired('cambio-aceite', '2020-01-01')
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar cita' }))

    expect(screen.getByText('La fecha no puede ser pasada.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid data and shows the confirmation', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderWithI18n(<AppointmentForm tenantId="demo-el-teide" services={SERVICES} onSubmit={onSubmit} />)

    fillRequired()
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar cita' }))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Luis García',
        serviceId: 'cambio-aceite',
        preferredDate: futureDate(),
      }),
    )
    expect(await screen.findByRole('status')).toHaveTextContent(/cita solicitada/i)
  })

  it('shows an error banner when submission fails', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('network'))
    renderWithI18n(<AppointmentForm tenantId="demo-el-teide" services={SERVICES} onSubmit={onSubmit} />)

    fillRequired()
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar cita' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no hemos podido/i)
    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
  })

  it('shows a rate-limit message with the retry seconds on a 429', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new RateLimitError(20, 'rate limited'))
    renderWithI18n(<AppointmentForm tenantId="demo-el-teide" services={SERVICES} onSubmit={onSubmit} />)

    fillRequired()
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar cita' }))

    expect(await screen.findByText(/espera 20 segundos/i)).toBeInTheDocument()
  })
})
