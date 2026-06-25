import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

afterEach(() => {
  vi.clearAllMocks()
})

describe('LegalPageView', () => {
  it('shows a loading status while the page is being fetched', () => {
    // A never-resolving promise keeps the component in the loading state.
    getLegalPageMock.mockReturnValue(new Promise<LegalPage>(() => {}))

    render(<LegalPageView tenantSlug="bm-construccion" type="POLITICA_PRIVACIDAD" />)

    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)
  })

  it('renders the title as the main heading on success', async () => {
    getLegalPageMock.mockResolvedValue(page)

    render(<LegalPageView tenantSlug="bm-construccion" type="POLITICA_PRIVACIDAD" />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Política de privacidad' }),
    ).toBeInTheDocument()
    expect(getLegalPageMock).toHaveBeenCalledWith('bm-construccion', 'POLITICA_PRIVACIDAD')
  })

  it('renders the trusted HTML content on success', async () => {
    getLegalPageMock.mockResolvedValue(page)

    render(<LegalPageView tenantSlug="bm-construccion" type="POLITICA_PRIVACIDAD" />)

    expect(await screen.findByText('BM Construcción S.L.')).toBeInTheDocument()
  })

  it('strips <script> tags from the HTML before rendering', async () => {
    getLegalPageMock.mockResolvedValue({
      ...page,
      content: '<p>Texto seguro</p><script>window.__pwned = true</script>',
    })

    const { container } = render(<LegalPageView tenantSlug="bm-construccion" type="POLITICA_PRIVACIDAD" />)

    await screen.findByText('Texto seguro')
    expect(container.querySelector('script')).toBeNull()
    expect(container.innerHTML).not.toContain('__pwned')
  })

  it('strips inline event-handler attributes like onclick', async () => {
    getLegalPageMock.mockResolvedValue({
      ...page,
      content: '<p onclick="alert(1)">Pulsa aquí</p>',
    })

    render(<LegalPageView tenantSlug="bm-construccion" type="POLITICA_PRIVACIDAD" />)

    const paragraph = await screen.findByText('Pulsa aquí')
    expect(paragraph).not.toHaveAttribute('onclick')
  })

  it('keeps whitelisted tags and attributes (links, emphasis)', async () => {
    getLegalPageMock.mockResolvedValue({
      ...page,
      content: '<p>Ver <a href="https://example.com">aviso</a> y <strong>condiciones</strong>.</p>',
    })

    render(<LegalPageView tenantSlug="bm-construccion" type="POLITICA_PRIVACIDAD" />)

    const link = await screen.findByRole('link', { name: 'aviso' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByText('condiciones').tagName).toBe('STRONG')
  })

  it('shows an error alert when the fetch fails', async () => {
    getLegalPageMock.mockRejectedValue(new Error('network down'))

    render(<LegalPageView tenantSlug="bm-construccion" type="POLITICA_PRIVACIDAD" />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/no se ha podido cargar/i)
    })
  })
})
