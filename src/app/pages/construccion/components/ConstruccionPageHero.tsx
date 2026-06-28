import styles from './ConstruccionPageHero.module.css'

interface ConstruccionPageHeroProps {
  /** Small uppercase label above the title. */
  eyebrow: string
  /** Page title (rendered in the display font). */
  title: string
  /** Optional supporting line under the title. */
  subtitle?: string
  /** Background photo URL. */
  image: string
}

/**
 * Compact section header ("page hero") for the multi-page construccion site:
 * background photo with scrim/glow/frame overlays + eyebrow, title and an
 * optional subtitle. Shared by the Servicios, Proyectos, Showroom and Contacto
 * pages.
 *
 * @param props.eyebrow - Uppercase label.
 * @param props.title - Page title.
 * @param props.subtitle - Optional supporting copy.
 * @param props.image - Background photo URL.
 */
export default function ConstruccionPageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: ConstruccionPageHeroProps) {
  return (
    <section className={styles.hero}>
      <img className={styles.img} src={image} alt="" aria-hidden="true" />
      <div className={styles.scrim} />
      <div className={styles.glow} />
      <div className={styles.frame} />
      <div className={styles.inner}>
        <div className={styles.eyebrow}>{eyebrow}</div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
      </div>
    </section>
  )
}
