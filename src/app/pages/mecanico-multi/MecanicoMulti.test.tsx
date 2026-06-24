import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { testI18n } from '../../../test-utils'
import MecanicoLayout from './MecanicoLayout'
import MecanicoHomePage from './MecanicoHomePage'
import MecanicoServiciosPage from './MecanicoServiciosPage'
import MecanicoCitaPage from './MecanicoCitaPage'
import MecanicoContactoPage from './MecanicoContactoPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={testI18n}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/mecanico-multi" element={<MecanicoLayout />}>
              <Route index element={<MecanicoHomePage />} />
              <Route path="servicios" element={<MecanicoServiciosPage />} />
              <Route path="cita" element={<MecanicoCitaPage />} />
              <Route path="contacto" element={<MecanicoContactoPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('Mecanico multi-page', () => {
  it('renders the primary nav with 4 links', () => {
    renderAt('/mecanico-multi')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent)

    expect(labels).toEqual(['Inicio', 'Servicios', 'Cita Previa', 'Contacto'])
  })

  it('marks the active route with aria-current="page"', () => {
    renderAt('/mecanico-multi/servicios')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Servicios' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('renders the home page with the hero and a CTA', () => {
    renderAt('/mecanico-multi')

    expect(
      screen.getByRole('heading', { level: 1, name: /taller mecánico el teide/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pedir cita previa' })).toHaveAttribute(
      'href',
      '/mecanico-multi/cita',
    )
  })

  it('renders the servicios page with the full services list', () => {
    renderAt('/mecanico-multi/servicios')

    expect(screen.getByRole('heading', { level: 1, name: 'Servicios' })).toBeInTheDocument()
    expect(screen.getByText('Mantenimiento y revisión')).toBeInTheDocument()
    expect(screen.getByText('Aire acondicionado')).toBeInTheDocument()
  })

  it('renders the cita page with the appointment form', () => {
    renderAt('/mecanico-multi/cita')

    expect(screen.getByRole('heading', { level: 1, name: 'Cita Previa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
  })

  it('renders the contacto page with the opening hours', () => {
    renderAt('/mecanico-multi/contacto')

    expect(screen.getByRole('heading', { level: 1, name: 'Dónde estamos' })).toBeInTheDocument()
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })
})
