import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import { createI18nInstance } from '../../../../i18n'
import { LegalSkeleton } from './LegalSkeleton'

describe('LegalSkeleton', () => {
  it('renders a labelled status region with decorative bars only (no visible text)', () => {
    const i18n = createI18nInstance('es')
    render(
      <I18nextProvider i18n={i18n}>
        <LegalSkeleton />
      </I18nextProvider>,
    )

    const status = screen.getByRole('status', { name: /cargando/i })
    expect(status).toBeInTheDocument()
    // Decorative bars carry no text content.
    expect(status.textContent).toBe('')
  })
})
