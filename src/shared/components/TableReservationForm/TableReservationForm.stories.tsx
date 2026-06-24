import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'
import { TableReservationForm } from './TableReservationForm'

/** Returns a `yyyy-mm-dd` date one week in the future (always a valid date). */
function futureDate(): string {
  return new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)
}

const meta = {
  title: 'Shared/TableReservationForm',
  component: TableReservationForm,
  args: {
    tenantId: 'demo-el-drago',
  },
} satisfies Meta<typeof TableReservationForm>

export default meta

type Story = StoryObj<typeof meta>

/** Fills every required field with valid data. */
async function fillValid(canvas: ReturnType<typeof within>) {
  fireEvent.change(canvas.getByLabelText('Nombre'), { target: { value: 'María Pérez' } })
  fireEvent.change(canvas.getByLabelText('Email'), { target: { value: 'maria@example.com' } })
  fireEvent.change(canvas.getByLabelText('Teléfono'), { target: { value: '600123456' } })
  fireEvent.change(canvas.getByLabelText('Fecha'), { target: { value: futureDate() } })
  fireEvent.change(canvas.getByLabelText('Hora'), { target: { value: '21:00' } })
}

/** Empty form, ready to fill. */
export const Idle: Story = {
  args: {
    onSubmit: fn(),
  },
}

/** Submission in flight: the button is disabled and shows progress. */
export const Submitting: Story = {
  args: {
    // Never resolves, so the form stays in the submitting state.
    onSubmit: () => new Promise<void>(() => {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillValid(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Reservar mesa' }))
    await expect(canvas.getByRole('button', { name: 'Enviando…' })).toBeDisabled()
  },
}

/** Successful submission: the confirmation panel replaces the form. */
export const Success: Story = {
  args: {
    onSubmit: fn(async () => {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillValid(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Reservar mesa' }))
    await expect(await canvas.findByRole('status')).toBeInTheDocument()
  },
}

/** Failed submission: an error banner is shown and the form stays editable. */
export const ErrorState: Story = {
  args: {
    onSubmit: fn(async () => {
      throw new Error('network down')
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillValid(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Reservar mesa' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent(/no hemos podido/i)
  },
}
