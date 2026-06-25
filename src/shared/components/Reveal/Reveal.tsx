import { useRef, type ReactNode } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

export interface RevealProps {
  /** Content to reveal when it scrolls into view. */
  children: ReactNode
  /** Optional delay in ms before revealing, for staggering sibling Reveals. */
  delay?: number
  /** Extra class merged onto the wrapper. */
  className?: string
}

/**
 * Wraps content in a block that fades up (see `shared/styles/animations.css`)
 * the first time it scrolls into view. Thin convenience around
 * {@link useScrollAnimation} for one-off section reveals (forms, footer, info).
 *
 * @param props.children - Content to reveal.
 * @param props.delay - Optional reveal delay in ms.
 * @param props.className - Extra class on the wrapper.
 * @returns The wrapper element.
 */
export function Reveal({ children, delay, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  useScrollAnimation(ref, delay)

  return (
    <div ref={ref} className={className ? `animate-on-scroll ${className}` : 'animate-on-scroll'}>
      {children}
    </div>
  )
}
