import { render, screen, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createI18nInstance } from '../../../../i18n'
import type { LegalPage } from '../../models/legal'
import { getLegalPage } from '../../services/legalService'
import { LegalPageView } from './LegalPageView'

vi.mock('../../services/legalService', () => ({
  getLegalPage: vi.fn(),
}))

const getLegalPageMock = vi.mocked(getLegalPage)

const page: LegalPage = {
  id: 'legal-1',
  tenantId: 'bm-construccion',
  type: 'POLITICA_PRIVACIDAD',
  content: '<h2>Responsable</h2><p>BM Construcción S.L.</p>',
  version: 3,
  publishedAt: '2026-03-14T09:00:00Z',
  active: true,
}

function renderView(type: LegalPage['type'] = 'POLITICA_PRIVACIDAD') {
  const i18n = createI18nInstance('es')
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <LegalPageView tenantSlug="bm-construccion" type={type} />
      </MemoryRouter>
    </I18nextProvider>,
  )
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('LegalPageView', () => {
  it('shows a labelled loading skeleton while the page is being fetched', () => {
    getLegalPageMock.mockReturnValue(new Promise<LegalPage>(() => {}))

    renderView()

    // The skeleton has no visible text; it is announced via its accessible name.
    expect(screen.getByRole('status', { name: /cargando/i })).toBeInTheDocument()
  })

  it('renders the title as the main heading on success', async () => {
    getLegalPageMock.mockResolvedValue(page)

    renderView()

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Política de privacidad' }),
    ).toBeInTheDocument()
    expect(getLegalPageMock).toHaveBeenCalledWith('bm-construccion', 'POLITICA_PRIVACIDAD')
  })

  it('renders the trusted HTML content on success', async () => {
    getLegalPageMock.mockResolvedValue(page)

    renderView()

    expect(await screen.findByText('BM Construcción S.L.')).toBeInTheDocument()
  })

  it('formats plain-text content into paragraphs and lifts the leading disclaimer', async () => {
    getLegalPageMock.mockResolvedValue({
      ...page,
      content: '[Plantilla base de prueba]\n\nPrimer párrafo.\n\nSegundo párrafo.',
    })

    const { container } = renderView()

    // Disclaimer shown as a separate callout (role note), not inline in the body.
    const note = await screen.findByRole('note')
    expect(note).toHaveTextContent('Plantilla base de prueba')
    expect(note.textContent).not.toContain('[')

    // Two real paragraphs in the content body.
    const texts = Array.from(container.querySelectorAll('p')).map((p) => p.textContent)
    expect(texts).toContain('Primer párrafo.')
    expect(texts).toContain('Segundo párrafo.')
  })

  it('renders the back actions on success', async () => {
    getLegalPageMock.mockResolvedValue(page)

    renderView()

    expect(await screen.findByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: 'Volver atrás' })).toBeInTheDocument()
  })

  it('strips <script> tags from the HTML before rendering', async () => {
    getLegalPageMock.mockResolvedValue({
      ...page,
      content: '<p>Texto seguro</p><script>window.__pwned = true</script>',
    })

    const { container } = renderView()

    await screen.findByText('Texto seguro')
    expect(container.querySelector('script')).toBeNull()
    expect(container.innerHTML).not.toContain('__pwned')
  })

  it('strips inline event-handler attributes like onclick', async () => {
    getLegalPageMock.mockResolvedValue({
      ...page,
      content: '<p onclick="alert(1)">Pulsa aquí</p>',
    })

    renderView()

    const paragraph = await screen.findByText('Pulsa aquí')
    expect(paragraph).not.toHaveAttribute('onclick')
  })

  it('keeps whitelisted tags and attributes (links, emphasis)', async () => {
    getLegalPageMock.mockResolvedValue({
      ...page,
      content: '<p>Ver <a href="https://example.com">aviso</a> y <strong>condiciones</strong>.</p>',
    })

    const { container } = renderView()

    const link = await screen.findByRole('link', { name: 'aviso' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(container.querySelector('strong')?.textContent).toBe('condiciones')
  })

  it('shows an error alert when the fetch fails', async () => {
    getLegalPageMock.mockRejectedValue(new Error('network down'))

    renderView()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/no se ha podido cargar/i)
    })
  })
})
