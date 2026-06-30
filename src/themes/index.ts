/**
 * Tenant theme loader.
 *
 * Each tenant site renders with exactly one theme. The theme is a plain CSS
 * file that defines the design tokens (`--color-*`, `--font-*`, `--radius-*`,
 * `--shadow-*`, `--spacing-section`) under `:root` and `[data-theme="<name>"]`.
 * This module loads the right CSS bundle on demand and marks the document so
 * the attribute can act as a styling/fallback hook.
 *
 * No React: `applyTheme` is a pure side-effecting function meant to be called
 * from `AppProviders` once the tenant configuration is known.
 */

/** Every theme shipped with the public web-frontend. */
export const THEME_NAMES = [
  'editorial',
  'moderno',
  'minimalista',
  'calido',
  'urbano',
  'fresco',
  'clasico',
  'mediterraneo',
  'obsidiana',
] as const

export type ThemeName = (typeof THEME_NAMES)[number]

/** Theme applied when an unknown/missing theme name is requested. */
export const FALLBACK_THEME: ThemeName = 'clasico'

/**
 * Maps each theme to a dynamic import of its CSS bundle, so only the selected
 * theme's stylesheet is fetched. Exported so it can be spied on in tests.
 */
export const themeLoaders: Record<ThemeName, () => Promise<unknown>> = {
  editorial: () => import('./theme-editorial.css'),
  moderno: () => import('./theme-moderno.css'),
  minimalista: () => import('./theme-minimalista.css'),
  calido: () => import('./theme-calido.css'),
  urbano: () => import('./theme-urbano.css'),
  fresco: () => import('./theme-fresco.css'),
  clasico: () => import('./theme-clasico.css'),
  mediterraneo: () => import('./theme-mediterraneo.css'),
  obsidiana: () => import('./theme-obsidiana.css'),
}

/**
 * Each theme's `--color-bg` value, mirrored here so `applyTheme` can paint the
 * document background synchronously — before the async CSS bundle resolves —
 * and avoid a flash of white (FOUC) on first render. Must stay in sync with the
 * `--color-bg` token of the matching `theme-*.css` file.
 */
export const THEME_BACKGROUNDS: Record<ThemeName, string> = {
  editorial: '#fbfaf7',
  moderno: '#ffffff',
  minimalista: '#ffffff',
  calido: '#faf3ea',
  urbano: '#0e0e11',
  fresco: '#f6fffb',
  clasico: '#f8f6f1',
  mediterraneo: '#f4fbff',
  obsidiana: '#0d0c09',
}

/** Type guard: narrows an arbitrary string to a known `ThemeName`. */
export function isThemeName(name: string): name is ThemeName {
  return (THEME_NAMES as readonly string[]).includes(name)
}

/**
 * Applies a tenant theme: marks `<html data-theme="...">` synchronously (so the
 * attribute-scoped tokens take effect immediately) and lazily loads the theme's
 * CSS bundle. Unknown theme names fall back to `clasico`.
 *
 * @param themeName - Theme to apply; falls back to `clasico` when unknown.
 */
export function applyTheme(themeName: string): void {
  const resolved: ThemeName = isThemeName(themeName) ? themeName : FALLBACK_THEME

  document.documentElement.setAttribute('data-theme', resolved)

  // Paint the theme background on <html> synchronously so there is no flash of
  // white while the (async) CSS bundle is still loading. Once the bundle
  // resolves, the stylesheet's `body { background: var(--color-bg) }` takes over.
  document.documentElement.style.backgroundColor = THEME_BACKGROUNDS[resolved]

  // Fire-and-forget: the CSS bundle styles the document once it resolves; the
  // data-theme attribute is already in place as the immediate fallback hook.
  void themeLoaders[resolved]()
}
