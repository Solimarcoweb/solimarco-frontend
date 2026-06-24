import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { trackPageView } from '../services/trackingService'

/**
 * Records a page-view every time the route path changes (and once on mount).
 * Renders nothing — it is a side-effect-only hook meant to be mounted high in
 * the tree, inside the router. The `tenantId` is passed in for now; it will
 * later come from tenant context once that provider exists.
 *
 * @param tenantId - Tenant the visits belong to.
 */
export function usePageTracking(tenantId: string): void {
  const { pathname } = useLocation()

  useEffect(() => {
    // document.referrer is "" when there is no referrer; normalize to undefined
    // so the optional field is omitted rather than sent empty.
    const referrer = document.referrer === '' ? undefined : document.referrer

    trackPageView({ tenantId, path: pathname, referrer })
  }, [tenantId, pathname])
}
