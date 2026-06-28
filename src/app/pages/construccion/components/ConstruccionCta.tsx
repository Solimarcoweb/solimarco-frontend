import { useTranslation } from 'react-i18next'
import styles from './ConstruccionCta.module.css'
import ConstruccionLink from './ConstruccionLink'

interface ConstruccionCtaProps {
  /** CTA target: anchor (`#contacto`, landing) or route (`contacto`, multi). */
  to?: string
}

/** Gold call-to-action band linking to the contact section/page. */
export default function ConstruccionCta({ to = '#contacto' }: ConstruccionCtaProps) {
  const { t } = useTranslation()

  return (
    <section className={styles.cta}>
      <p className={styles.text}>{t('construccion.ctaText')}</p>
      <ConstruccionLink className={styles.btn} to={to}>
        {t('construccion.ctaButton')} →
      </ConstruccionLink>
    </section>
  )
}
