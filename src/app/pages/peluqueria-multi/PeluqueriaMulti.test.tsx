import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { testI18n } from '../../../test-utils'
import PeluqueriaLayout from './PeluqueriaLayout'
import PeluqueriaHomePage from './PeluqueriaHomePage'
import PeluqueriaServiciosPage from './PeluqueriaServiciosPage'
import PeluqueriaCitaPage from './PeluqueriaCitaPage'
import PeluqueriaContactoPage from './PeluqueriaContactoPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={testI18n}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/peluqueria-multi" element={<PeluqueriaLayout />}>
              <Route index element={<PeluqueriaHomePage />} />
              <Route path="servicios" element={<PeluqueriaServiciosPage />} />
              <Route path="cita" element={<PeluqueriaCitaPage />} />
              <Route path="contacto" element={<PeluqueriaContactoPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('Peluqueria multi-page', () => {
  it('renders the primary nav with 4 links', () => {
    renderAt('/peluqueria-multi')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent)

    expect(labels).toEqual(['Inicio', 'Servicios', 'Cita', 'Contacto'])
  })

  it('marks the active route with aria-current="page"', () => {
    renderAt('/peluqueria-multi/servicios')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Servicios' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('renders the home page with the hero and a CTA', () => {
    renderAt('/peluqueria-multi')

    expect(
      screen.getByRole('heading', { level: 1, name: /peluquería brisa atlántica/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pedir cita' })).toHaveAttribute(
      'href',
      '/peluqueria-multi/cita',
    )
  })

  it('renders the servicios page with the full services list', () => {
    renderAt('/peluqueria-multi/servicios')

    expect(screen.getByRole('heading', { level: 1, name: 'Servicios' })).toBeInTheDocument()
    expect(screen.getAllByText('Corte y peinado mujer').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Tratamiento de keratina').length).toBeGreaterThan(0)
  })

  it('renders the cita page with the appointment form', () => {
    renderAt('/peluqueria-multi/cita')

    expect(screen.getByRole('heading', { level: 1, name: 'Pedir cita' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
  })

  it('renders the contacto page with the opening hours', () => {
    renderAt('/peluqueria-multi/contacto')

    expect(screen.getByRole('heading', { level: 1, name: 'Dónde estamos' })).toBeInTheDocument()
    expect(screen.getByText('Martes')).toBeInTheDocument()
    expect(screen.getAllByText('Cerrado').length).toBeGreaterThan(0)
  })
})
