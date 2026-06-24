import { env } from '../../../core/constants/env'
import type { TrackingEvent } from '../models/tracking'

const TRACK_PATH = '/api/track'

/**
 * Sends a page-view event to the backend `POST /api/track` endpoint.
 *
 * Best-effort by design: it never throws and never returns anything, so a
 * tracking failure can never affect the user-facing flow. It prefers
 * `navigator.sendBeacon()` (non-blocking and survives page unload) and falls
 * back to `fetch()` with `keepalive` when the Beacon API is unavailable or
 * refuses to queue the request. The backend replies `204 No Content`, so there
 * is no response body to read.
 *
 * @param event - The page-view event to record.
 */
export function trackPageView(event: TrackingEvent): void {
  const url = `${env.apiBaseUrl}${TRACK_PATH}`
  const payload = JSON.stringify(event)

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' })
      // sendBeacon returns false when the user agent cannot queue the request;
      // in that case we fall through to the fetch path below.
      if (navigator.sendBeacon(url, blob)) {
        return
      }
    }

    sendWithFetch(url, payload)
  } catch {
    // Tracking is best-effort: swallow any synchronous error so the caller
    // (route changes, page unload) is never affected by a tracking failure.
  }
}

/**
 * Fallback transport used when the Beacon API is not available.
 * Uses `keepalive` so the request can still complete during page unload, and
 * swallows any rejection since tracking must never surface errors.
 */
function sendWithFetch(url: string, payload: string): void {
  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // Best-effort: ignore network/transport errors.
  })
}
