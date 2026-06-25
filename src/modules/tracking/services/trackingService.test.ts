import { afterEach, describe, expect, it, vi } from 'vitest'
import { env } from '../../../core/constants/env'
import type { TrackingEvent } from '../models/tracking'
import { trackPageView } from './trackingService'

const event: TrackingEvent = {
  tenantId: 'bm-construccion',
  path: '/tienda',
  referrer: 'https://www.google.com/',
}

const expectedUrl = `${env.apiBaseUrl}/api/track`

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('trackPageView', () => {
  it('sends the event via sendBeacon to /api/track as a JSON blob', async () => {
    const sendBeacon = vi.fn().mockReturnValue(true)
    vi.stubGlobal('navigator', { sendBeacon })

    trackPageView(event)

    expect(sendBeacon).toHaveBeenCalledTimes(1)
    const [url, blob] = sendBeacon.mock.calls[0] as [string, Blob]
    expect(url).toBe(expectedUrl)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/json')
    expect(await blob.text()).toBe(JSON.stringify(event))
  })

  it('falls back to fetch with keepalive when sendBeacon is unavailable', () => {
    vi.stubGlobal('navigator', {})
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    trackPageView(event)

    expect(fetchMock).toHaveBeenCalledWith(
      expectedUrl,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(event),
        keepalive: true,
      }),
    )
  })

  it('falls back to fetch when sendBeacon refuses to queue the request', () => {
    vi.stubGlobal('navigator', { sendBeacon: vi.fn().mockReturnValue(false) })
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    trackPageView(event)

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('ignores a 429 response from the fetch fallback (best-effort)', () => {
    // Tracking does not go through apiClient, never inspects the response status
    // and never throws, so a 429 (with Retry-After) is silently ignored.
    vi.stubGlobal('navigator', {})
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 429, headers: { 'Retry-After': '60' } }))
    vi.stubGlobal('fetch', fetchMock)

    expect(() => trackPageView(event)).not.toThrow()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('never throws when the transport fails', () => {
    vi.stubGlobal('navigator', {
      sendBeacon: vi.fn(() => {
        throw new Error('beacon exploded')
      }),
    })

    expect(() => trackPageView(event)).not.toThrow()
  })
})
