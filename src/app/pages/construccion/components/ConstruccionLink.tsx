import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { joinBase, useConstruccionRouteBase } from './construccionRouteBase'

interface ConstruccionLinkProps {
  /**
   * Target. An in-page anchor (`#id`) renders an `<a>` (landing). A route
   * segment (e.g. `contacto`) renders a router `<Link>` resolved to an ABSOLUTE
   * path against the layout base from context (multi-page); without a base in
   * scope it falls back to the raw value.
   */
  to: string
  className?: string
  children: ReactNode
  onClick?: () => void
}

/**
 * Dual-purpose link for the construccion sector: in-page anchor for `#` targets
 * (single-page landing) and an absolute router `<Link>` for route segments
 * (multi-page site). Building absolute paths from the runtime base avoids the
 * relative-resolution segment accumulation on nested routes.
 */
export default function ConstruccionLink({ to, className, children, onClick }: ConstruccionLinkProps) {
  const base = useConstruccionRouteBase()

  if (to.startsWith('#')) {
    return (
      <a href={to} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  const target = base != null ? joinBase(base, to) : to
  return (
    <Link to={target} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
