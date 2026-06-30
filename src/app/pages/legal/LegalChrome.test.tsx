import { render, screen, within } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { createI18nInstance } from '../../../i18n'
import type { TenantConfig } from '../../../core/tenant/tenantConfig'
import { SectorChrome } from './legalChromeRegistry'

const baseConfig: TenantConfig = {
  tenantId: 'bm-construccion',
  businessName: 'BM Construcción S.L.',
  themeName: 'clasico',
  siteType: 'FULL',
  sector: 'construccion',
  locale: 'es',
  businessDescription: 'Reformas y obra nueva en Tenerife.',
  phone: '+34 922 65 41 30',
  email: 'info@bmconstruccionsl.com',
  address: 'Calle La Hornera 48, La Laguna',
  modules: { hasShop: false, hasReservations: false, hasCitas: false, hasBudgetForm: true },
}

function renderChrome(config: TenantConfig) {
  const i18n = createI18nInstance('es')
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <SectorChrome config={config}>
          <div>CONTENIDO LEGAL</div>
        </SectorChrome>
      </MemoryRouter>
    </I18nextProvider>,
  )
}

describe('legal chrome registry', () => {
  it('wraps construccion FULL in the sector header (route nav) + footer around the content', () => {
    renderChrome(baseConfig)

    const nav = screen.getByRole('navigation', { name: 'Inicio' })
    // Header route nav points at the tenant root, not /legal/...
    expect(within(nav).getByRole('link', { name: 'Servicios' })).toHaveAttribute(
      'href',
      '/servicios',
    )
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText('CONTENIDO LEGAL')).toBeInTheDocument()
  })

  it('uses a minimal header (logo → home) for construccion LANDING', () => {
    renderChrome({ ...baseConfig, siteType: 'LANDING' })

    // No multi-page section nav; brand links home.
    expect(screen.queryByRole('link', { name: 'Servicios' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /BM Construcción/ })[0]).toHaveAttribute('href', '/')
    // Legal links still reachable in the minimal footer.
    expect(screen.getByRole('link', { name: 'Política de cookies' })).toHaveAttribute(
      'href',
      '/legal/cookies',
    )
    expect(screen.getByText('CONTENIDO LEGAL')).toBeInTheDocument()
  })

  it('falls back to a generic chrome for an unregistered sector', () => {
    renderChrome({ ...baseConfig, sector: 'restaurante' })

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'BM Construcción S.L.' })).toHaveAttribute('href', '/')
    expect(screen.getByText('CONTENIDO LEGAL')).toBeInTheDocument()
  })
})
