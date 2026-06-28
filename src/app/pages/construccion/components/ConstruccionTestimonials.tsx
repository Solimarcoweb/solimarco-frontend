import { useTranslation } from 'react-i18next'
import styles from './ConstruccionTestimonials.module.css'
import { CONSTRUCCION_TESTIMONIALS } from '../construccionShared'

/**
 * Client testimonials section.
 *
 * SAMPLE - temporal hasta endpoint/personalización: los testimonios vienen de
 * {@link CONSTRUCCION_TESTIMONIALS}; cuando exista contrato de backend se migra.
 */
export default function ConstruccionTestimonials() {
  const { t } = useTranslation()

  return (
    <section className={styles.section} aria-labelledby="construccion-testimonials-h">
      <div className={styles.inner}>
        <div className={styles.eyebrow}>{t('construccion.testimonialsEyebrow')}</div>
        <h2 id="construccion-testimonials-h" className={styles.title}>
          {t('construccion.testimonialsHeading')}
        </h2>

        <div className={styles.grid}>
          {CONSTRUCCION_TESTIMONIALS.map((item) => (
            <figure key={item.name} className={styles.card}>
              <blockquote className={styles.quote}>{item.quote}</blockquote>
              <figcaption>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.role}>{item.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
