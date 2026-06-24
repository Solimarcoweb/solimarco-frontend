import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { testI18n } from '../../../test-utils'
import GenericoLayout from './GenericoLayout'
import GenericoHomePage from './GenericoHomePage'
import GenericoServiciosPage from './GenericoServiciosPage'
import GenericoPresupuestoPage from './GenericoPresupuestoPage'
import GenericoContactoPage from './GenericoContactoPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={testI18n}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/generico-multi" element={<GenericoLayout />}>
              <Route index element={<GenericoHomePage />} />
              <Route path="servicios" element={<GenericoServiciosPage />} />
              <Route path="presupuesto" element={<GenericoPresupuestoPage />} />
              <Route path="contacto" element={<GenericoContactoPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('GenericoLayout', () => {
  it('renders the brand name in the header', () => {
    renderAt('/generico-multi')

    expect(screen.getAllByText('Servicios Profesionales Tenerife').length).toBeGreaterThan(0)
  })

  it('renders the four nav links', () => {
    renderAt('/generico-multi')

    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Servicios' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Presupuesto' })).toBeInTheDocument()
  })

  it('marks the active nav link with aria-current="page"', () => {
    renderAt('/generico-multi')

    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'page')
  })
})

describe('GenericoHomePage', () => {
  it('renders the hero heading', () => {
    renderAt('/generico-multi')

    expect(
      screen.getByRole('heading', { level: 1, name: /servicios profesionales tenerife/i }),
    ).toBeInTheDocument()
  })

  it('renders featured services', () => {
    renderAt('/generico-multi')

    expect(screen.getAllByText('Consultoría y asesoramiento').length).toBeGreaterThan(0)
  })

  it('renders the CTA link to the budget page', () => {
    renderAt('/generico-multi')

    expect(screen.getByRole('link', { name: 'Solicitar presupuesto' })).toHaveAttribute(
      'href',
      '/generico-multi/presupuesto',
    )
  })
})

describe('GenericoServiciosPage', () => {
  it('renders the page heading', () => {
    renderAt('/generico-multi/servicios')

    expect(screen.getByRole('heading', { level: 1, name: 'Nuestros servicios' })).toBeInTheDocument()
  })

  it('renders all six services', () => {
    renderAt('/generico-multi/servicios')

    expect(screen.getAllByText('Consultoría y asesoramiento').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Gestión de proyectos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Tramitaciones y gestiones').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Soporte y mantenimiento').length).toBeGreaterThan(0)
  })
})

describe('GenericoPresupuestoPage', () => {
  it('renders the page heading', () => {
    renderAt('/generico-multi/presupuesto')

    expect(screen.getByRole('heading', { level: 1, name: 'Solicitar presupuesto' })).toBeInTheDocument()
  })

  it('renders the budget form submit button', () => {
    renderAt('/generico-multi/presupuesto')

    expect(screen.getByRole('button', { name: /solicitar presupuesto/i })).toBeInTheDocument()
  })
})

describe('GenericoContactoPage', () => {
  it('renders the page heading', () => {
    renderAt('/generico-multi/contacto')

    expect(screen.getByRole('heading', { level: 1, name: 'Dónde estamos' })).toBeInTheDocument()
  })

  it('renders the business address', () => {
    renderAt('/generico-multi/contacto')

    expect(screen.getAllByText(/Méndez Núñez/i).length).toBeGreaterThan(0)
  })
})
