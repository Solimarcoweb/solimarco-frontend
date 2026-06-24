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
  slug: 'privacidad',
  title: 'Política de privacidad',
  content: '<h2>Responsable</h2><p>BM Construcción S.L.</p>',
  updatedAt: '2026-03-14T09:00:00Z',
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('LegalPageView', () => {
  it('shows a loading status while the page is being fetched', () => {
    // A never-resolving promise keeps the component in the loading state.
    getLegalPageMock.mockReturnValue(new Promise<LegalPage>(() => {}))

    render(<LegalPageView tenantId="bm-construccion" slug="privacidad" />)

    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)
  })

  it('renders the title as the main heading on success', async () => {
    getLegalPageMock.mockResolvedValue(page)

    render(<LegalPageView tenantId="bm-construccion" slug="privacidad" />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Política de privacidad' }),
    ).toBeInTheDocument()
    expect(getLegalPageMock).toHaveBeenCalledWith('bm-construccion', 'privacidad')
  })

  it('renders the trusted HTML content on success', async () => {
    getLegalPageMock.mockResolvedValue(page)

    render(<LegalPageView tenantId="bm-construccion" slug="privacidad" />)

    expect(await screen.findByText('BM Construcción S.L.')).toBeInTheDocument()
  })

  it('shows an error alert when the fetch fails', async () => {
    getLegalPageMock.mockRejectedValue(new Error('network down'))

    render(<LegalPageView tenantId="bm-construccion" slug="privacidad" />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/no se ha podido cargar/i)
    })
  })
})
