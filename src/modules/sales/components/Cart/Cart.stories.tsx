import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Cart } from './Cart'
import type { CartItem } from '../../models/product'

const items: CartItem[] = [
  {
    id: 'cemento-cem-ii-25',
    name: 'Cemento gris CEM II 25 kg',
    description: 'Cemento de uso general. Saco de 25 kg.',
    price: 8.45,
    unit: 'saco',
    category: 'Cemento y áridos',
    quantity: 10,
  },
  {
    id: 'pintura-plastica-blanca-15',
    name: 'Pintura plástica blanca mate 15 L',
    description: 'Pintura interior lavable, acabado mate.',
    price: 34.5,
    unit: 'cubo',
    category: 'Pinturas y barnices',
    quantity: 2,
  },
]

const meta = {
  title: 'Sales/Cart',
  component: Cart,
  parameters: {
    layout: 'padded',
  },
  args: {
    tenantId: 'bm-construccion',
    items,
    onUpdateQuantity: fn(),
    onRemove: fn(),
    onSubmit: fn(async () => ({ id: 'order-1', status: 'pendiente' })),
  },
} satisfies Meta<typeof Cart>

export default meta

type Story = StoryObj<typeof meta>

/** Fills the customer contact fields with valid data. */
async function fillCustomer(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  await userEvent.type(canvas.getByLabelText('Nombre'), 'María Hernández')
  await userEvent.type(canvas.getByLabelText('Email'), 'maria.hernandez@example.com')
  await userEvent.type(canvas.getByLabelText('Teléfono'), '600 123 456')
}

/** Cart with items, ready for checkout. */
export const WithItems: Story = {}

/** Empty cart state. */
export const Empty: Story = {
  args: {
    items: [],
  },
}

/** Mid-submission: the injected handler never resolves, so the cart stays submitting. */
export const Submitting: Story = {
  args: {
    onSubmit: fn(() => new Promise<never>(() => {})),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCustomer(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Finalizar pedido' }))
    await waitFor(() => expect(canvas.getByRole('button', { name: /procesando/i })).toBeDisabled())
  },
}

/** Successful order shows the confirmation panel. */
export const Success: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCustomer(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Finalizar pedido' }))
    await waitFor(() => expect(canvas.getByText(/pedido realizado/i)).toBeInTheDocument())
  },
}

/** Failed order shows the error banner and keeps the cart. */
export const Failure: Story = {
  name: 'Error',
  args: {
    onSubmit: fn(() => Promise.reject(new Error('Network error'))),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCustomer(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Finalizar pedido' }))
    await waitFor(() => expect(canvas.getByText(/no hemos podido procesar/i)).toBeInTheDocument())
  },
}
