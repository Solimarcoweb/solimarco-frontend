import { useEffect, useRef, useState } from 'react'
import { apiClient } from '../http/apiClient'
import type { TenantConfig } from './tenantConfig'
import { getCurrentTenantId } from './tenantResolver'

type TenantState =
  | { status: 'loading' }
  | { status: 'success'; config: TenantConfig }
  | { status: 'error'; message: string }

/** Module-level cache: one resolved config per tenant slug per page lifecycle. */
const cache = new Map<string, TenantConfig>()

/**
 * Resolves the current tenant's configuration from the backend.
 * The result is cached in module memory so subsequent renders do not trigger
 * additional network requests within the same page lifecycle.
 *
 * @returns The current loading / success / error state of the tenant config.
 */
export function useTenant(): TenantState {
  const tenantId = useRef(getCurrentTenantId()).current
  const [state, setState] = useState<TenantState>(() => {
    const cached = cache.get(tenantId)
    return cached ? { status: 'success', config: cached } : { status: 'loading' }
  })

  useEffect(() => {
    if (state.status !== 'loading') return

    let cancelled = false

    apiClient<TenantConfig>(`/api/tenants/${tenantId}/config`)
      .then((config) => {
        if (cancelled) return
        cache.set(tenantId, config)
        setState({ status: 'success', config })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Failed to load tenant configuration.'
        setState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
  // Only run once per mount; tenantId is stable (ref).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
