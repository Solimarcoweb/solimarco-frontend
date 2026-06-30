import type { JSX } from 'react'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import LegalPageRoute from '../../../modules/legal/components/LegalPageRoute/LegalPageRoute'
import { SectorChrome } from './legalChromeRegistry'

/**
 * Wraps the global `/legal/:slug` page in the active tenant sector's chrome
 * (header + footer + palette), so legal pages are visually integrated into the
 * site instead of rendering bare. The sector → chrome mapping lives in
 * {@link SectorChrome}; unmapped sectors get a generic fallback.
 */
export default function LegalChrome(): JSX.Element {
  const config = useTenantConfig()

  return (
    <SectorChrome config={config}>
      <LegalPageRoute />
    </SectorChrome>
  )
}
