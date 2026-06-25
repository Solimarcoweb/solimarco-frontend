import { render, screen, waitFor } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useScrollAnimation } from './useScrollAnimation'

/** Test harness: a div wired to the hook, exposing its class list via testid. */
function Probe({ delay }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useScrollAnimation(ref, delay)
  return <div ref={ref} data-testid="el" className="animate-on-scroll" />
}

/**
 * Installs a mock IntersectionObserver and returns a `trigger` that replays an
 * entry to the hook's callback (intersecting, and/or already scrolled past).
 */
function stubObserver(): { trigger: (opts: { isIntersecting: boolean; top?: number }) => void } {
  // Filled in when the hook constructs the observer; delegated to at call time
  // (so the wrapper returned below stays stable across the reassignment).
  let fire: ((opts: { isIntersecting: boolean; top?: number }) => void) | undefined

  class MockObserver {
    constructor(callback: IntersectionObserverCallback) {
      fire = ({ isIntersecting, top = 100 }) =>
        callback(
          [{ isIntersecting, boundingClientRect: { top } } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        )
    }
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn(() => [])
  }

  vi.stubGlobal('IntersectionObserver', MockObserver)
  return { trigger: (opts) => fire?.(opts) }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useScrollAnimation', () => {
  it('adds the "visible" class when the observer reports intersection', async () => {
    const { trigger } = stubObserver()

    render(<Probe />)
    const el = screen.getByTestId('el')
    expect(el).not.toHaveClass('visible')

    // Still hidden while the element is below the viewport.
    trigger({ isIntersecting: false, top: 500 })
    expect(el).not.toHaveClass('visible')

    // Revealed once it enters the viewport.
    trigger({ isIntersecting: true, top: 50 })
    await waitFor(() => expect(el).toHaveClass('visible'))
  })

  it('reveals an element that was scrolled past without intersecting', async () => {
    const { trigger } = stubObserver()

    render(<Probe />)
    const el = screen.getByTestId('el')

    // Not intersecting, but already above the viewport (e.g. an anchor jump).
    trigger({ isIntersecting: false, top: -200 })
    await waitFor(() => expect(el).toHaveClass('visible'))
  })

  it('reveals the element immediately when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)

    render(<Probe />)

    expect(screen.getByTestId('el')).toHaveClass('visible')
  })
})
