import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { BudgetForm } from './BudgetForm'

const meta = {
  title: 'Reservations/BudgetForm',
  component: BudgetForm,
  parameters: {
    layout: 'padded',
  },
  args: {
    tenantId: 'bm-construccion',
    onSubmit: fn(async () => ({ id: 'lead-1', status: 'pendiente' })),
  },
} satisfies Meta<typeof BudgetForm>

export default meta

type Story = StoryObj<typeof meta>

/** Fills every required field with realistic construction/reform data. */
async function fillValidForm(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await userEvent.type(canvas.getByLabelText('Nombre'), 'María Hernández')
  await userEvent.type(canvas.getByLabelText('Teléfono'), '600 123 456')
  await userEvent.type(canvas.getByLabelText('Email'), 'maria.hernandez@example.com')
  await userEvent.selectOptions(canvas.getByLabelText('Tipo de servicio'), 'reforma-integral')
  await userEvent.type(
    canvas.getByLabelText('Descripción del proyecto'),
    'Reforma integral de un piso de 90 m² en La Laguna: cocina, dos baños y suelos.',
  )
}

/** Empty form, ready to be filled. */
export const Idle: Story = {}

/** Mid-submission: the injected handler never resolves, so the form stays submitting. */
export const Submitting: Story = {
  args: {
    onSubmit: fn(() => new Promise<never>(() => {})),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillValidForm(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Solicitar presupuesto' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: /enviando/i })).toBeDisabled())
  },
}

/** Successful submission shows the confirmation panel. */
export const Success: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillValidForm(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Solicitar presupuesto' }))
    await waitFor(() => expect(canvas.getByText(/solicitud enviada/i)).toBeInTheDocument())
  },
}

/** Failed submission shows the error banner and keeps the form data. */
export const Failure: Story = {
  name: 'Error',
  args: {
    onSubmit: fn(() => Promise.reject(new Error('Network error'))),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillValidForm(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Solicitar presupuesto' }))
    await waitFor(() => expect(canvas.getByText(/no hemos podido enviar/i)).toBeInTheDocument())
  },
}
