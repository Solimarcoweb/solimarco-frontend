import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../../../../test-utils'
import { RateLimitError } from '../../../../core/http/apiClient'
import { BudgetForm } from './BudgetForm'

/** Fills every required field with valid data using the given email. */
function fillValidFields(email = 'maria@example.com') {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'María Hernández' } })
  fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '600123456' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Descripción del proyecto'), {
    target: { value: 'Reforma integral de un piso de 90 m².' },
  })
}

describe('BudgetForm', () => {
  it('renders all the form fields', () => {
    renderWithI18n(<BudgetForm tenantId="bm-construccion" />)

    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Tipo de servicio')).toBeInTheDocument()
    expect(screen.getByLabelText('Descripción del proyecto')).toBeInTheDocument()
    expect(screen.getByLabelText(/fecha preferida/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Solicitar presupuesto' })).toBeInTheDocument()
  })

  it('blocks submission and shows an error when the email is invalid', () => {
    const onSubmit = vi.fn()
    renderWithI18n(<BudgetForm tenantId="bm-construccion" onSubmit={onSubmit} />)

    fillValidFields('no-es-un-email')
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar presupuesto' }))

    expect(screen.getByText(/formato válido/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows the confirmation panel after a successful submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ id: 'lead-1', status: 'pendiente' })
    renderWithI18n(<BudgetForm tenantId="bm-construccion" onSubmit={onSubmit} />)

    fillValidFields()
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar presupuesto' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'maria@example.com', serviceType: 'obra-nueva' }),
    )
    expect(await screen.findByText(/solicitud enviada/i)).toBeInTheDocument()
  })

  it('shows a rate-limit message with the retry seconds on a 429', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new RateLimitError(30, 'rate limited'))
    renderWithI18n(<BudgetForm tenantId="bm-construccion" onSubmit={onSubmit} />)

    fillValidFields()
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar presupuesto' }))

    expect(await screen.findByText(/espera 30 segundos/i)).toBeInTheDocument()
  })
})
