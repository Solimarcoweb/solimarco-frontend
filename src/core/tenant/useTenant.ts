import { useEffect, useState } from 'react'
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
  // Derived during render: the tenant slug is a pure function of the current
  // hostname, stable for the whole page lifecycle. No ref/state needed.
  const tenantId = getCurrentTenantId()

  const [state, setState] = useState<TenantState>(() => {
    const cached = cache.get(tenantId)
    return cached ? { status: 'success', config: cached } : { status: 'loading' }
  })

  useEffect(() => {
    // Fetch only when there is no resolved config yet for this tenant.
    if (cache.has(tenantId)) return

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
  }, [tenantId])

  return state
}
