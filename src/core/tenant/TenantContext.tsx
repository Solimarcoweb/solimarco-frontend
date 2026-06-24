import { createContext, useContext, useEffect, type ReactNode } from 'react'
import styles from './TenantContext.module.css'
import { applyTheme } from '../../themes'
import type { TenantConfig } from './tenantConfig'
import { useTenant } from './useTenant'

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

  useEffect(() => {
    if (state.status === 'success') {
      applyTheme(state.config.themeName)
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
