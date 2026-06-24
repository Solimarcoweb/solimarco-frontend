import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import EsteticaLayout from './EsteticaLayout'
import EsteticaHomePage from './EsteticaHomePage'
import EsteticaTratamientosPage from './EsteticaTratamientosPage'
import EsteticaCitaPage from './EsteticaCitaPage'
import EsteticaContactoPage from './EsteticaContactoPage'

vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({
  usePageTracking: () => {},
}))

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/estetica-multi" element={<EsteticaLayout />}>
            <Route index element={<EsteticaHomePage />} />
            <Route path="tratamientos" element={<EsteticaTratamientosPage />} />
            <Route path="cita" element={<EsteticaCitaPage />} />
            <Route path="contacto" element={<EsteticaContactoPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('Estetica multi-page', () => {
  it('renders the primary nav with 4 links', () => {
    renderAt('/estetica-multi')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent)

    expect(labels).toEqual(['Inicio', 'Tratamientos', 'Cita', 'Contacto'])
  })

  it('marks the active route with aria-current="page"', () => {
    renderAt('/estetica-multi/tratamientos')

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Tratamientos' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('renders the home page with the hero and a CTA', () => {
    renderAt('/estetica-multi')

    expect(
      screen.getByRole('heading', { level: 1, name: /centro estético magnolia/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pedir cita previa →' })).toHaveAttribute(
      'href',
      '/estetica-multi/cita',
    )
  })

  it('renders the tratamientos page with the full list', () => {
    renderAt('/estetica-multi/tratamientos')

    expect(screen.getByRole('heading', { level: 1, name: 'Tratamientos' })).toBeInTheDocument()
    expect(screen.getByText('Tratamientos faciales')).toBeInTheDocument()
    expect(screen.getByText('Depilación')).toBeInTheDocument()
  })

  it('renders the cita page with the appointment form', () => {
    renderAt('/estetica-multi/cita')

    expect(screen.getByRole('heading', { level: 1, name: 'Pedir cita' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
  })

  it('renders the contacto page with the opening hours', () => {
    renderAt('/estetica-multi/contacto')

    expect(screen.getByRole('heading', { level: 1, name: 'Dónde estamos' })).toBeInTheDocument()
    expect(screen.getByText('Martes')).toBeInTheDocument()
    expect(screen.getAllByText('Cerrado').length).toBeGreaterThan(0)
  })
})
