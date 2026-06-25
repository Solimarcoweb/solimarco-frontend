import { useEffect, type RefObject } from 'react'

/**
 * Reveals an element when it first scrolls into view: adds the `visible` class
 * (styled in `shared/styles/animations.css`) the first time the element
 * intersects the viewport, then stops observing so it never re-animates.
 *
 * Uses the IntersectionObserver API (no scroll listeners). When
 * IntersectionObserver is unavailable (e.g. jsdom in tests, very old browsers)
 * the element is revealed immediately so content is never stuck hidden.
 * `prefers-reduced-motion` is handled in CSS.
 *
 * @param ref - Ref to the element to reveal; it should carry the
 *   `animate-on-scroll` class.
 * @param delay - Optional delay in ms before revealing, used to stagger lists.
 */
export function useScrollAnimation<T extends HTMLElement>(
  ref: RefObject<T | null>,
  delay = 0,
): void {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    // No IntersectionObserver support: reveal immediately.
    if (typeof IntersectionObserver === 'undefined') {
      element.classList.add('visible')
      return
    }

    let timeoutId: number | undefined

    const observer = new IntersectionObserver(
      (entries, obs) => {
        const entry = entries[0]
        if (!entry) return
        // Reveal when the element enters the viewport, or when it has already
        // been scrolled past (top above the viewport) — e.g. an in-page anchor
        // jump over it — so a skipped section is never left blank.
        const scrolledPast = (entry.boundingClientRect?.top ?? 0) < 0
        if (!entry.isIntersecting && !scrolledPast) return
        // Animate only once: stop observing on first reveal.
        obs.disconnect()
        timeoutId = window.setTimeout(() => element.classList.add('visible'), delay)
      },
      { threshold: 0.1 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [ref, delay])
}
