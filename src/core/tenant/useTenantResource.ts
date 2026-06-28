import { useEffect, useRef, useState } from 'react'
import { getCurrentTenantId } from './tenantResolver'

/** Loading / success / error state of a tenant resource request. */
export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }

/** Resolved resources keyed by `slug/resource`, kept for the page lifecycle. */
const cache = new Map<string, unknown>()
/** In-flight requests keyed the same way, so concurrent hooks share one fetch. */
const inflight = new Map<string, Promise<unknown>>()

/** Loads (and caches) a resource, deduping concurrent requests by key. */
function load<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (cache.has(key)) return Promise.resolve(cache.get(key) as T)

  const existing = inflight.get(key)
  if (existing) return existing as Promise<T>

  const request = fetcher()
    .then((data) => {
      cache.set(key, data)
      inflight.delete(key)
      return data
    })
    .catch((err: unknown) => {
      inflight.delete(key)
      throw err
    })

  inflight.set(key, request)
  return request as Promise<T>
}

/**
 * Generic loader for a per-tenant resource (services, projects, hours…).
 * Resolves the current tenant from the hostname, fetches once, caches the
 * result in module memory and dedupes concurrent callers.
 *
 * @param resource - Stable resource key, used for caching (e.g. `"services"`).
 * @param fetcher - Function that fetches the resource for a tenant slug.
 * @returns The loading / success / error state of the resource.
 */
export function useTenantResource<T>(
  resource: string,
  fetcher: (tenantSlug: string) => Promise<T>,
): ResourceState<T> {
  const tenantId = useRef(getCurrentTenantId()).current
  const key = `${tenantId}/${resource}`

  const [state, setState] = useState<ResourceState<T>>(() =>
    cache.has(key) ? { status: 'success', data: cache.get(key) as T } : { status: 'loading' },
  )

  useEffect(() => {
    if (state.status !== 'loading') return

    let cancelled = false

    load(key, () => fetcher(tenantId))
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Failed to load tenant resource.'
        setState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
    // Run once per mount; key/fetcher are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
