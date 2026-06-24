import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEMO_TENANT_ID, getCurrentTenantId } from './tenantResolver'

/** Replaces `window.location.hostname` for the duration of a test. */
function setHostname(hostname: string) {
  vi.stubGlobal('window', { location: { hostname } })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getCurrentTenantId', () => {
  it('extracts the subdomain from a production hostname', () => {
    setHostname('bm-construccion.solimarco.es')
    expect(getCurrentTenantId()).toBe('bm-construccion')
  })

  it('extracts the subdomain from a localhost dev hostname', () => {
    setHostname('bm-construccion.localhost')
    expect(getCurrentTenantId()).toBe('bm-construccion')
  })

  it('returns "demo" when accessed via the root production domain', () => {
    setHostname('solimarco.es')
    expect(getCurrentTenantId()).toBe(DEMO_TENANT_ID)
  })

  it('returns "demo" when accessed directly via localhost', () => {
    setHostname('localhost')
    expect(getCurrentTenantId()).toBe(DEMO_TENANT_ID)
  })

  it('returns "demo" for an unrecognised hostname', () => {
    setHostname('192.168.1.10')
    expect(getCurrentTenantId()).toBe(DEMO_TENANT_ID)
  })
})
