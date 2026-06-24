import { type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { render, type RenderOptions } from '@testing-library/react'
import { createI18nInstance } from './i18n/config'

/**
 * Shared i18n instance for tests — uses the `es` locale so Spanish assertions stay valid.
 * Exported so page-level tests can compose their own wrappers (e.g. HelmetProvider +
 * I18nextProvider + MemoryRouter) without duplicating the instance.
 */
export const testI18n = createI18nInstance('es')

/** Renders `ui` wrapped in an `I18nextProvider` configured for Spanish. */
export function renderWithI18n(ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(<I18nextProvider i18n={testI18n}>{ui}</I18nextProvider>, options)
}
