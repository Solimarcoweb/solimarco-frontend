import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the title as the main heading', () => {
    render(
      <Hero
        title="Reformas integrales en Tenerife"
        subtitle="Proyecto llave en mano"
        ctaLabel="Solicitar presupuesto"
        ctaHref="#contacto"
      />,
    )

    expect(
      screen.getByRole('heading', { level: 1, name: /reformas integrales en tenerife/i }),
    ).toBeInTheDocument()
  })

  it('renders the call-to-action pointing at the given href', () => {
    render(
      <Hero
        title="Reformas integrales en Tenerife"
        subtitle="Proyecto llave en mano"
        ctaLabel="Solicitar presupuesto"
        ctaHref="#contacto"
      />,
    )

    expect(screen.getByRole('link', { name: /solicitar presupuesto/i })).toHaveAttribute(
      'href',
      '#contacto',
    )
  })
})
