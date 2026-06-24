import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackPageView } from '../services/trackingService'
import { usePageTracking } from './usePageTracking'

vi.mock('../services/trackingService', () => ({
  trackPageView: vi.fn(),
}))

const trackPageViewMock = vi.mocked(trackPageView)

/** Test harness that mounts the hook and exposes a way to change the route. */
function Harness({ tenantId }: { tenantId: string }) {
  usePageTracking(tenantId)
  const navigate = useNavigate()

  return (
    <button type="button" onClick={() => navigate('/contacto')}>
      go
    </button>
  )
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('usePageTracking', () => {
  it('tracks the current page once on mount', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Harness tenantId="bm-construccion" />
      </MemoryRouter>,
    )

    expect(trackPageViewMock).toHaveBeenCalledTimes(1)
    expect(trackPageViewMock).toHaveBeenCalledWith(
      expect.objectContaining({ tenantId: 'bm-construccion', path: '/' }),
    )
  })

  it('tracks again when the route path changes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Harness tenantId="bm-construccion" />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'go' }))

    expect(trackPageViewMock).toHaveBeenCalledTimes(2)
    expect(trackPageViewMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ tenantId: 'bm-construccion', path: '/contacto' }),
    )
  })
})
