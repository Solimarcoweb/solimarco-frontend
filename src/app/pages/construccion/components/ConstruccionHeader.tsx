import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './ConstruccionHeader.module.css'

interface ConstruccionHeaderProps {
  /** Tenant business name rendered as the brand logo. */
  businessName: string
}

/** In-page anchor targets for the single-page construccion landing. */
const SECTIONS = [
  { id: 'top', key: 'construccion.nav.home' },
  { id: 'servicios', key: 'construccion.nav.services' },
  { id: 'proyectos', key: 'construccion.nav.projects' },
  { id: 'showroom', key: 'construccion.nav.showroom' },
  { id: 'contacto', key: 'construccion.nav.contact' },
] as const

/**
 * Fixed header for the construccion landing: two-tone brand logo, in-page
 * smooth-scroll navigation and a quote CTA. On mobile (<768px) the nav collapses
 * into a fullscreen menu toggled by an animated burger button.
 *
 * @param props.businessName - Tenant name shown as the brand mark.
 */
export default function ConstruccionHeader({ businessName }: ConstruccionHeaderProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

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

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label={t('construccion.nav.home')}>
        <a className={styles.logo} href="#top" onClick={() => setOpen(false)}>
          {firstWord}
          {rest && <span> {rest}</span>}
        </a>

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
          {SECTIONS.map((s) => (
            <a key={s.id} className={styles.link} href={`#${s.id}`} onClick={() => setOpen(false)}>
              {t(s.key)}
            </a>
          ))}
        </div>

        <a className={styles.cta} href="#contacto" onClick={() => setOpen(false)}>
          {t('construccion.ctaRequestQuote')}
        </a>
      </nav>
    </header>
  )
}
