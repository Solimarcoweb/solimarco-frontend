import type { TenantConfig } from './tenantConfig'

/**
 * Frontend salvaguarda: sector → theme overrides applied until the backend
 * emits the right `themeName` per tenant (and the panel ships its theme
 * selector). Construccion's design is dark, so it must render with the
 * `obsidiana` theme even if the backend still sends a light theme such as
 * `clasico`. Once the backend is authoritative, entries here can be removed.
 *
 * PENDING (coordinated backend change): the construccion tenant config must
 * emit `themeName: 'obsidiana'`; this override covers it meanwhile.
 */
export const SECTOR_THEME_OVERRIDES: Record<string, string> = {
  construccion: 'obsidiana',
}

/**
 * Resolves the effective theme name for a tenant. The backend `themeName` is the
 * intended source of truth, but a sector override (see
 * {@link SECTOR_THEME_OVERRIDES}) takes precedence as a temporary salvaguarda
 * for sectors whose backend theme is not yet aligned with their design.
 *
 * @param config - Resolved tenant configuration (needs `sector` + `themeName`).
 * @returns The theme name to apply.
 */
export function resolveTenantTheme(config: Pick<TenantConfig, 'sector' | 'themeName'>): string {
  return SECTOR_THEME_OVERRIDES[config.sector] ?? config.themeName
}
