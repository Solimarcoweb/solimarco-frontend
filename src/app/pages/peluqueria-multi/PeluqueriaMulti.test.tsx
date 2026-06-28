import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import PeluqueriaLayout from './PeluqueriaLayout'
import PeluqueriaHomePage from './PeluqueriaHomePage'
import PeluqueriaServiciosPage from './PeluqueriaServiciosPage'
import PeluqueriaCitaPage from './PeluqueriaCitaPage'
import PeluqueriaContactoPage from './PeluqueriaContactoPage'

const config: TenantConfig = {
  tenantId: 'demo-brisa-atlantica',
  businessName: 'Peluquería Brisa Atlántica',
  themeName: 'mediterraneo',
  siteType: 'FULL',
  sector: 'peluqueria',
  locale: 'es',
  businessDescription: 'Corte, color, mechas y tratamientos capilares.',
  phone: '+34 922 79 05 44',
  email: 'hola@brisaatlantica.es',
  address: 'Avenida Juan Carlos I 23, Los Cristianos',
  modules: { hasShop: false, hasReservations: false, hasCitas: true, hasBudgetForm: false },
}

vi.mock('../../../core/tenant/TenantContext', () => ({
  useTenantConfig: () => config,
  useOptionalTenantConfig: () => config,
}))
vi.mock('../../../modules/tracking/hooks/usePageTracking', () => ({ usePageTracking: () => {} }))

const servicesData = [
  {
    id: 'corte-mujer',
    name: 'Corte y peinado mujer',
    description: 'Consulta de imagen.',
    imageUrl: 'https://example.com/c.jpg',
    displayOrder: 1,
  },
  {
    id: 'keratina',
    name: 'Tratamiento de keratina',
    description: 'Alisado progresivo.',
    imageUrl: 'https://example.com/k.jpg',
    displayOrder: 2,
  },
]

const hoursData = {
  weekly: [
    {
      dayOfWeek: 'MONDAY',
      closed: false,
      morningOpen: '09:30',
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: '19:30',
    },
    {
      dayOfWeek: 'SUNDAY',
      closed: true,
      morningOpen: null,
      morningClose: null,
      afternoonOpen: null,
      afternoonClose: null,
    },
  ],
  upcomingExceptions: [],
}

vi.mock('../../../core/tenant/useServices', () => ({
  useServices: () => ({ status: 'success', data: servicesData }),
}))
vi.mock('../../../core/tenant/useBusinessHours', () => ({
  useBusinessHours: () => ({ status: 'success', data: hoursData }),
}))

function renderAt(path: string) {
  const i18n = createI18nInstance('es')
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
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
    expect(within(nav).getByRole('link', { name: 'Servicios' })).toHaveAttribute('aria-current', 'page')
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
    expect(screen.getByText('Corte y peinado mujer')).toBeInTheDocument()
    expect(screen.getByText('Tratamiento de keratina')).toBeInTheDocument()
  })

  it('renders the cita page with the appointment form', () => {
    renderAt('/peluqueria-multi/cita')

    expect(screen.getByRole('heading', { level: 1, name: 'Pedir cita' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Solicitar cita' })).toBeInTheDocument()
  })

  it('renders the contacto page with the opening hours', () => {
    renderAt('/peluqueria-multi/contacto')

    expect(screen.getByRole('heading', { level: 1, name: 'Dónde estamos' })).toBeInTheDocument()
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Cerrado')).toBeInTheDocument()
  })
})
