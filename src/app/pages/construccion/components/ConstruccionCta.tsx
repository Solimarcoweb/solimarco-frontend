import { useTranslation } from 'react-i18next'
import styles from './ConstruccionCta.module.css'

/** Gold call-to-action band linking to the contact section. */
export default function ConstruccionCta() {
  const { t } = useTranslation()

  return (
    <section className={styles.cta}>
      <p className={styles.text}>{t('construccion.ctaText')}</p>
      <a className={styles.btn} href="#contacto">
        {t('construccion.ctaButton')} →
      </a>
    </section>
  )
}
