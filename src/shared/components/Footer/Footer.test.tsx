import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from './Footer'

const baseProps = {
  businessName: 'BM Construcción S.L.',
  address: 'Calle La Hornera 48, 38320 San Cristóbal de La Laguna, Santa Cruz de Tenerife',
  phone: '+34 922 65 41 30',
  email: 'info@bmconstruccionsl.com',
  legalLinks: [
    { label: 'Aviso legal', href: '/legal/aviso-legal' },
    { label: 'Política de privacidad', href: '/legal/privacidad' },
    { label: 'Política de cookies', href: '/legal/cookies' },
  ],
}

describe('Footer', () => {
  it('renders the business name as a heading', () => {
    render(<Footer {...baseProps} />)

    expect(
      screen.getByRole('heading', { name: /bm construcción s\.l\./i }),
    ).toBeInTheDocument()
  })

  it('renders the phone as a tel link with the normalized number', () => {
    render(<Footer {...baseProps} />)

    expect(screen.getByRole('link', { name: '+34 922 65 41 30' })).toHaveAttribute(
      'href',
      'tel:+34922654130',
    )
  })

  it('renders every legal link pointing at its href', () => {
    render(<Footer {...baseProps} />)

    for (const link of baseProps.legalLinks) {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.href)
    }
  })
})
