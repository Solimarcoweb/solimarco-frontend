import type { Meta, StoryObj } from '@storybook/react-vite'
import { Footer } from './Footer'

const meta = {
  title: 'Shared/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Default footer with realistic content for the construction/reform pilot sector
 * (BM Construcción S.L., Tenerife), including the standard legal links.
 */
export const Default: Story = {
  args: {
    businessName: 'BM Construcción S.L.',
    address: 'Calle La Hornera 48, 38320 San Cristóbal de La Laguna, Santa Cruz de Tenerife',
    phone: '+34 922 65 41 30',
    email: 'info@bmconstruccionsl.com',
    legalLinks: [
      { label: 'Aviso legal', href: '/legal/aviso-legal' },
      { label: 'Política de privacidad', href: '/legal/privacidad' },
      { label: 'Política de cookies', href: '/legal/cookies' },
      { label: 'Términos de venta', href: '/legal/terminos-venta' },
    ],
  },
}
