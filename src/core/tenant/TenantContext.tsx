import { createContext, useContext, useEffect, type ReactNode } from 'react'
import styles from './TenantContext.module.css'
import { applyTheme } from '../../themes'
import type { TenantConfig } from './tenantConfig'
import { resolveTenantTheme } from './tenantTheme'
import { useTenant } from './useTenant'
import { useTenantBranding } from './useTenantBranding'

const TenantContext = createContext<TenantConfig | null>(null)

/**
 * Reads the resolved `TenantConfig` from context.
 * Must be called inside a `TenantProvider` tree; throws otherwise.
 *
 * @returns The current tenant's configuration.
 * @throws When called outside of a `TenantProvider`.
 */
export function useTenantConfig(): TenantConfig {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenantConfig must be used inside TenantProvider')
  return ctx
}

/**
 * Like `useTenantConfig` but returns `null` instead of throwing when called
 * outside a `TenantProvider`. Intended for shared components (e.g. `SharedSeo`)
 * that want to use tenant data as a fallback without requiring a provider.
 *
 * @returns The current tenant's configuration, or `null` if unavailable.
 */
export function useOptionalTenantConfig(): TenantConfig | null {
  return useContext(TenantContext)
}

interface TenantProviderProps {
  children: ReactNode
}

/**
 * Resolves the tenant configuration on mount and makes it available to the
 * entire app via context. Renders a loading indicator while the config is
 * being fetched and an error screen if the request fails.
 * Applies the tenant's theme as a side effect once the config is ready.
 *
 * @param props.children - The app subtree that consumes tenant configuration.
 */
export function TenantProvider({ children }: TenantProviderProps) {
  const state = useTenant()
  const config = state.status === 'success' ? state.config : null

  useTenantBranding(config)

  useEffect(() => {
    if (state.status === 'success') {
      applyTheme(resolveTenantTheme(state.config))
    }
  }, [state])

  if (state.status === 'loading') {
    return <div className={styles.loader} role="status" aria-live="polite">Cargando…</div>
  }

  if (state.status === 'error') {
    return (
      <div className={styles.error} role="alert">
        <h1 className={styles.errorTitle}>No se pudo cargar el sitio</h1>
        <p className={styles.errorText}>{state.message}</p>
      </div>
    )
  }

  return (
    <TenantContext.Provider value={state.config}>
      {children}
    </TenantContext.Provider>
  )
}
