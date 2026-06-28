import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { testI18n } from '../../test-utils'
import type { TenantConfig } from './tenantConfig'
import TenantRouter from './TenantRouter'

// ── useTenantConfig mock ─────────────────────────────────────────────────────

const mockUseTenantConfig = vi.fn<() => TenantConfig>()

vi.mock('./TenantContext', () => ({
  useTenantConfig: () => mockUseTenantConfig(),
}))

// ── Landing page stubs ───────────────────────────────────────────────────────

vi.mock('../../app/pages/construccion/ConstruccionLandingPage', () => ({
  default: () => <div data-testid="page-construccion-landing" />,
}))
vi.mock('../../app/pages/restaurante-landing/RestauranteLandingPage', () => ({
  default: () => <div data-testid="page-restaurante-landing" />,
}))
vi.mock('../../app/pages/mecanico-landing/MecanicoLandingPage', () => ({
  default: () => <div data-testid="page-mecanico-landing" />,
}))
vi.mock('../../app/pages/tienda-landing/TiendaLandingPage', () => ({
  default: () => <div data-testid="page-tienda-landing" />,
}))
vi.mock('../../app/pages/estetica-landing/EsteticaLandingPage', () => ({
  default: () => <div data-testid="page-estetica-landing" />,
}))
vi.mock('../../app/pages/peluqueria-landing/PeluqueriaLandingPage', () => ({
  default: () => <div data-testid="page-peluqueria-landing" />,
}))
vi.mock('../../app/pages/generico-landing/GenericoLandingPage', () => ({
  default: () => <div data-testid="page-generico-landing" />,
}))

// ── Multi-page layout stubs (must render <Outlet> for index routes) ──────────

vi.mock('../../app/pages/construccion-multi/ConstruccionLayout', async () => {
  const { Outlet } = await import('react-router')
  return { default: () => <div data-testid="layout-construccion"><Outlet /></div> }
})
vi.mock('../../app/pages/restaurante-multi/RestauranteLayout', async () => {
  const { Outlet } = await import('react-router')
  return { default: () => <div data-testid="layout-restaurante"><Outlet /></div> }
})
vi.mock('../../app/pages/mecanico-multi/MecanicoLayout', async () => {
  const { Outlet } = await import('react-router')
  return { default: () => <div data-testid="layout-mecanico"><Outlet /></div> }
})
vi.mock('../../app/pages/tienda-multi/TiendaLayout', async () => {
  const { Outlet } = await import('react-router')
  return { default: () => <div data-testid="layout-tienda"><Outlet /></div> }
})
vi.mock('../../app/pages/estetica-multi/EsteticaLayout', async () => {
  const { Outlet } = await import('react-router')
  return { default: () => <div data-testid="layout-estetica"><Outlet /></div> }
})
vi.mock('../../app/pages/peluqueria-multi/PeluqueriaLayout', async () => {
  const { Outlet } = await import('react-router')
  return { default: () => <div data-testid="layout-peluqueria"><Outlet /></div> }
})
vi.mock('../../app/pages/generico-multi/GenericoLayout', async () => {
  const { Outlet } = await import('react-router')
  return { default: () => <div data-testid="layout-generico"><Outlet /></div> }
})

// ── Index (home) page stubs for each multi-page sector ───────────────────────

vi.mock('../../app/pages/construccion-multi/ConstruccionHomePage', () => ({
  default: () => <div data-testid="page-construccion-home" />,
}))
vi.mock('../../app/pages/restaurante-multi/RestauranteHomePage', () => ({
  default: () => <div data-testid="page-restaurante-home" />,
}))
vi.mock('../../app/pages/mecanico-multi/MecanicoHomePage', () => ({
  default: () => <div data-testid="page-mecanico-home" />,
}))
vi.mock('../../app/pages/tienda-multi/TiendaHomePage', () => ({
  default: () => <div data-testid="page-tienda-home" />,
}))
vi.mock('../../app/pages/estetica-multi/EsteticaHomePage', () => ({
  default: () => <div data-testid="page-estetica-home" />,
}))
vi.mock('../../app/pages/peluqueria-multi/PeluqueriaHomePage', () => ({
  default: () => <div data-testid="page-peluqueria-home" />,
}))
vi.mock('../../app/pages/generico-multi/GenericoHomePage', () => ({
  default: () => <div data-testid="page-generico-home" />,
}))

// ── Global legal route stub ──────────────────────────────────────────────────

vi.mock('../../modules/legal/components/LegalPageRoute/LegalPageRoute', () => ({
  default: () => <div data-testid="legal-route" />,
}))

// ─────────────────────────────────────────────────────────────────────────────

function config(sector: string, pageType: TenantConfig['pageType']): TenantConfig {
  return {
    tenantId: 'test',
    businessName: 'Test',
    themeName: 'clasico',
    sector,
    pageType,
    locale: 'es',
  }
}

function renderRouter(initialPath = '/') {
  return render(
    <HelmetProvider>
      <I18nextProvider i18n={testI18n}>
        <MemoryRouter initialEntries={[initialPath]}>
          <TenantRouter />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  )
}

describe('TenantRouter — landing pages', () => {
  it('renders ConstruccionPage for construccion + landing', async () => {
    mockUseTenantConfig.mockReturnValue(config('construccion', 'landing'))
    renderRouter()
    await waitFor(() => expect(screen.getByTestId('page-construccion-landing')).toBeInTheDocument())
  })

  it('renders RestauranteLandingPage for restaurante + landing', async () => {
    mockUseTenantConfig.mockReturnValue(config('restaurante', 'landing'))
    renderRouter()
    await waitFor(() => expect(screen.getByTestId('page-restaurante-landing')).toBeInTheDocument())
  })

  it('renders MecanicoLandingPage for mecanico + landing', async () => {
    mockUseTenantConfig.mockReturnValue(config('mecanico', 'landing'))
    renderRouter()
    await waitFor(() => expect(screen.getByTestId('page-mecanico-landing')).toBeInTheDocument())
  })

  it('renders TiendaLandingPage for tienda + landing', async () => {
    mockUseTenantConfig.mockReturnValue(config('tienda', 'landing'))
    renderRouter()
    await waitFor(() => expect(screen.getByTestId('page-tienda-landing')).toBeInTheDocument())
  })

  it('renders EsteticaLandingPage for estetica + landing', async () => {
    mockUseTenantConfig.mockReturnValue(config('estetica', 'landing'))
    renderRouter()
    await waitFor(() => expect(screen.getByTestId('page-estetica-landing')).toBeInTheDocument())
  })

  it('renders PeluqueriaLandingPage for peluqueria + landing', async () => {
    mockUseTenantConfig.mockReturnValue(config('peluqueria', 'landing'))
    renderRouter()
    await waitFor(() => expect(screen.getByTestId('page-peluqueria-landing')).toBeInTheDocument())
  })

  it('renders GenericoLandingPage for generico + landing', async () => {
    mockUseTenantConfig.mockReturnValue(config('generico', 'landing'))
    renderRouter()
    await waitFor(() => expect(screen.getByTestId('page-generico-landing')).toBeInTheDocument())
  })

  it('renders GenericoLandingPage for an unknown sector', async () => {
    mockUseTenantConfig.mockReturnValue(config('desconocido', 'landing'))
    renderRouter()
    await waitFor(() => expect(screen.getByTestId('page-generico-landing')).toBeInTheDocument())
  })
})

describe('TenantRouter — multi-page (layout + index route)', () => {
  it('renders ConstruccionLayout + home for construccion + multi', async () => {
    mockUseTenantConfig.mockReturnValue(config('construccion', 'multi'))
    renderRouter()
    await waitFor(() => {
      expect(screen.getByTestId('layout-construccion')).toBeInTheDocument()
      expect(screen.getByTestId('page-construccion-home')).toBeInTheDocument()
    })
  })

  it('renders RestauranteLayout + home for restaurante + multi', async () => {
    mockUseTenantConfig.mockReturnValue(config('restaurante', 'multi'))
    renderRouter()
    await waitFor(() => {
      expect(screen.getByTestId('layout-restaurante')).toBeInTheDocument()
      expect(screen.getByTestId('page-restaurante-home')).toBeInTheDocument()
    })
  })

  it('renders MecanicoLayout + home for mecanico + multi', async () => {
    mockUseTenantConfig.mockReturnValue(config('mecanico', 'multi'))
    renderRouter()
    await waitFor(() => {
      expect(screen.getByTestId('layout-mecanico')).toBeInTheDocument()
      expect(screen.getByTestId('page-mecanico-home')).toBeInTheDocument()
    })
  })

  it('renders TiendaLayout + home for tienda + multi', async () => {
    mockUseTenantConfig.mockReturnValue(config('tienda', 'multi'))
    renderRouter()
    await waitFor(() => {
      expect(screen.getByTestId('layout-tienda')).toBeInTheDocument()
      expect(screen.getByTestId('page-tienda-home')).toBeInTheDocument()
    })
  })

  it('renders EsteticaLayout + home for estetica + multi', async () => {
    mockUseTenantConfig.mockReturnValue(config('estetica', 'multi'))
    renderRouter()
    await waitFor(() => {
      expect(screen.getByTestId('layout-estetica')).toBeInTheDocument()
      expect(screen.getByTestId('page-estetica-home')).toBeInTheDocument()
    })
  })

  it('renders PeluqueriaLayout + home for peluqueria + multi', async () => {
    mockUseTenantConfig.mockReturnValue(config('peluqueria', 'multi'))
    renderRouter()
    await waitFor(() => {
      expect(screen.getByTestId('layout-peluqueria')).toBeInTheDocument()
      expect(screen.getByTestId('page-peluqueria-home')).toBeInTheDocument()
    })
  })

  it('renders GenericoLayout + home for generico + multi', async () => {
    mockUseTenantConfig.mockReturnValue(config('generico', 'multi'))
    renderRouter()
    await waitFor(() => {
      expect(screen.getByTestId('layout-generico')).toBeInTheDocument()
      expect(screen.getByTestId('page-generico-home')).toBeInTheDocument()
    })
  })
})

describe('TenantRouter — global legal route', () => {
  it('renders LegalPageRoute for /legal/:slug regardless of sector', async () => {
    mockUseTenantConfig.mockReturnValue(config('construccion', 'landing'))
    renderRouter('/legal/privacidad')

    await waitFor(() => expect(screen.getByTestId('legal-route')).toBeInTheDocument())
  })

  it('still renders the sector page on the root path', async () => {
    mockUseTenantConfig.mockReturnValue(config('construccion', 'landing'))
    renderRouter('/')

    await waitFor(() =>
      expect(screen.getByTestId('page-construccion-landing')).toBeInTheDocument(),
    )
    expect(screen.queryByTestId('legal-route')).toBeNull()
  })
})
