import type { Meta, StoryObj } from '@storybook/react-vite'
import { BusinessInfo, type BusinessHours } from './BusinessInfo'

const meta = {
  title: 'Shared/BusinessInfo',
  component: BusinessInfo,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BusinessInfo>

export default meta

type Story = StoryObj<typeof meta>

/** Realistic opening hours for the restaurant landing demo (Pastelería La Isla). */
const hours: BusinessHours[] = [
  { day: 'Lunes', open: '', close: '', closed: true },
  { day: 'Martes', open: '08:30', close: '20:00' },
  { day: 'Miércoles', open: '08:30', close: '20:00' },
  { day: 'Jueves', open: '08:30', close: '20:00' },
  { day: 'Viernes', open: '08:30', close: '20:30' },
  { day: 'Sábado', open: '09:00', close: '20:30' },
  { day: 'Domingo', open: '09:00', close: '14:00' },
]

export const Default: Story = {
  args: {
    address: 'Calle del Castillo 32, 38002 Santa Cruz de Tenerife',
    phone: '+34 922 24 18 60',
    email: 'hola@pasterialaisla.es',
    hours,
    mapImageUrl: 'https://picsum.photos/seed/mapa-la-isla/1200/450',
  },
}
