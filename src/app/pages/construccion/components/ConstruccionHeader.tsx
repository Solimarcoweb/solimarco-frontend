import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'
import styles from './ConstruccionHeader.module.css'
import { CONSTRUCCION_NAV, joinBase, useConstruccionRouteBase } from './construccionRouteBase'

interface ConstruccionHeaderProps {
  /** Tenant business name rendered as the brand logo. */
  businessName: string
  /**
   * Navigation mode:
   * - `scroll` (default): in-page anchors with smooth scroll (single-page landing).
   * - `route`: absolute router NavLinks with active highlighting (multi-page site).
   */
  variant?: 'scroll' | 'route'
}

/**
 * Fixed header for the construccion sector: two-tone brand logo, primary nav and
 * a quote CTA. On mobile (<768px) the nav collapses into a fullscreen menu
 * toggled by an animated burger button. Works in two modes (see `variant`):
 * in-page scroll for the landing, and absolute routing (with `aria-current`) for
 * the multi-page site — targets are built from the runtime base in context so
 * they are correct in both the dev-preview and production mounts.
 *
 * @param props.businessName - Tenant name shown as the brand mark.
 * @param props.variant - `scroll` (anchors) or `route` (router NavLinks).
 */
export default function ConstruccionHeader({
  businessName,
  variant = 'scroll',
}: ConstruccionHeaderProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const isRoute = variant === 'route'
  const base = useConstruccionRouteBase() ?? ''

  // Lock body scroll while the fullscreen mobile menu is open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Two-tone brand: first word in text colour, the rest in the accent colour.
  const [firstWord, ...restWords] = businessName.split(' ')
  const rest = restWords.join(' ')
  const close = () => setOpen(false)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.linkActive}` : styles.link

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label={t('construccion.nav.home')}>
        {isRoute ? (
          <Link to={base} className={styles.logo} onClick={close}>
            {firstWord}
            {rest && <span> {rest}</span>}
          </Link>
        ) : (
          <a className={styles.logo} href="#top" onClick={close}>
            {firstWord}
            {rest && <span> {rest}</span>}
          </a>
        )}

        <button
          type="button"
          className={open ? `${styles.burger} ${styles.burgerOpen}` : styles.burger}
          aria-label="Menú"
          aria-expanded={open}
          aria-controls="construccion-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="construccion-menu"
          className={open ? `${styles.links} ${styles.linksOpen}` : styles.links}
        >
          {CONSTRUCCION_NAV.map((item) =>
            isRoute ? (
              <NavLink
                key={item.anchorId}
                to={item.seg ? joinBase(base, item.seg) : base}
                end={item.end}
                className={navLinkClass}
                onClick={close}
              >
                {t(item.labelKey)}
              </NavLink>
            ) : (
              <a
                key={item.anchorId}
                className={styles.link}
                href={`#${item.anchorId}`}
                onClick={close}
              >
                {t(item.labelKey)}
              </a>
            ),
          )}
        </div>

        {isRoute ? (
          <Link to={joinBase(base, 'contacto')} className={styles.cta} onClick={close}>
            {t('construccion.ctaRequestQuote')}
          </Link>
        ) : (
          <a className={styles.cta} href="#contacto" onClick={close}>
            {t('construccion.ctaRequestQuote')}
          </a>
        )}
      </nav>
    </header>
  )
}
