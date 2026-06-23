import type { CSSProperties } from 'react'
import styles from './Hero.module.css'

export interface HeroProps {
  /** Main headline. Rendered as the page H1; hierarchy comes from weight/color, not raw size. */
  title: string
  /** Supporting line under the headline. */
  subtitle: string
  /** Visible label of the primary call-to-action button. */
  ctaLabel: string
  /** Destination of the call-to-action (anchor href). */
  ctaHref: string
  /** Optional full-bleed background image URL; adds an overlay and light text for legibility. */
  backgroundImage?: string
}

/**
 * Full-height hero block for the public per-tenant sites.
 * Centers the content vertically/horizontally over a single-column,
 * mobile-first layout and exposes a single primary call-to-action.
 *
 * @param props.title - Main headline (rendered as H1).
 * @param props.subtitle - Supporting copy under the headline.
 * @param props.ctaLabel - Visible label of the primary CTA.
 * @param props.ctaHref - Destination href of the primary CTA.
 * @param props.backgroundImage - Optional background image URL; enables overlay + light text.
 * @returns The hero section element.
 */
export function Hero({ title, subtitle, ctaLabel, ctaHref, backgroundImage }: HeroProps) {
  const hasBackground = backgroundImage !== undefined && backgroundImage !== ''

  const sectionClassName = hasBackground ? `${styles.hero} ${styles.hasBackground}` : styles.hero

  const sectionStyle: CSSProperties | undefined = hasBackground
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined

  return (
    <section className={sectionClassName} style={sectionStyle}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <a className={styles.cta} href={ctaHref}>
          {ctaLabel}
        </a>
      </div>
    </section>
  )
}
