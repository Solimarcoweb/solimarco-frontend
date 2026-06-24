import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'
import { AppointmentForm } from './AppointmentForm'
import type { Service } from '../ServicesList'

const SERVICES: Service[] = [
  { id: 'cambio-aceite', name: 'Cambio de aceite y filtros', description: 'Aceite sintético y filtros.' },
  { id: 'frenos', name: 'Frenos y suspensión', description: 'Pastillas, discos, amortiguadores.' },
  { id: 'itv', name: 'Pre-revisión ITV', description: 'Comprobación previa a la ITV.' },
  { id: 'electricidad', name: 'Electricidad y electrónica', description: 'Diagnóstico OBD y averías eléctricas.' },
]

function futureDate(): string {
  return new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)
}

async function fillValid(canvas: ReturnType<typeof within>) {
  fireEvent.change(canvas.getByLabelText('Nombre'), { target: { value: 'Luis García' } })
  fireEvent.change(canvas.getByLabelText('Teléfono'), { target: { value: '600111222' } })
  fireEvent.change(canvas.getByLabelText('Email'), { target: { value: 'luis@example.com' } })
  fireEvent.change(canvas.getByLabelText('Servicio'), { target: { value: 'cambio-aceite' } })
  fireEvent.change(canvas.getByLabelText('Fecha preferida'), { target: { value: futureDate() } })
  fireEvent.change(canvas.getByLabelText('Hora preferida'), { target: { value: '10:00' } })
}

const meta = {
  title: 'Shared/AppointmentForm',
  component: AppointmentForm,
  args: {
    tenantId: 'demo-el-teide',
    services: SERVICES,
  },
} satisfies Meta<typeof AppointmentForm>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {
  args: { onSubmit: fn() },
}

export const Submitting: Story = {
  args: {
    onSubmit: () => new Promise<void>(() => {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillValid(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Solicitar cita' }))
    await expect(canvas.getByRole('button', { name: 'Enviando…' })).toBeDisabled()
  },
}

export const Success: Story = {
  args: {
    onSubmit: fn(async () => {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillValid(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Solicitar cita' }))
    await expect(await canvas.findByRole('status')).toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: {
    onSubmit: fn(async () => {
      throw new Error('network down')
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillValid(canvas)
    await userEvent.click(canvas.getByRole('button', { name: 'Solicitar cita' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent(/no hemos podido/i)
  },
}

export const ValidationErrors: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Solicitar cita' }))
    await expect(await canvas.findByText('Indica tu nombre.')).toBeInTheDocument()
  },
}
