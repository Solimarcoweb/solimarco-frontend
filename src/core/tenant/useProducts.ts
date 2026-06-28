import { useEffect, useState } from 'react'
import type { ProductItem } from '../../modules/sales/models/product'
import { getProducts } from '../../modules/sales/services/salesService'
import { useTenantConfig } from './TenantContext'
import type { ResourceState } from './useTenantResource'

/** Resolved product catalogs keyed by tenant slug, kept for the page lifecycle. */
const cache = new Map<string, ProductItem[]>()

/**
 * Resolves the current tenant's product catalog from
 * `GET /api/products/public?tenantId={tenantId}` (existing sales endpoint),
 * using the slug from `useTenantConfig`. Caches the result in module memory.
 *
 * @returns The loading / success / error state of the product list.
 */
export function useProducts(): ResourceState<ProductItem[]> {
  const { tenantId } = useTenantConfig()

  const [state, setState] = useState<ResourceState<ProductItem[]>>(() =>
    cache.has(tenantId) ? { status: 'success', data: cache.get(tenantId)! } : { status: 'loading' },
  )

  useEffect(() => {
    if (cache.has(tenantId)) {
      setState({ status: 'success', data: cache.get(tenantId)! })
      return
    }

    let cancelled = false
    setState({ status: 'loading' })

    getProducts(tenantId)
      .then((data) => {
        if (cancelled) return
        cache.set(tenantId, data)
        setState({ status: 'success', data })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Failed to load products.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [tenantId])

  return state
}
