import { useTranslation } from 'react-i18next'
import styles from './ConstruccionServices.module.css'
import { Reveal } from '../../../../shared/components/Reveal'
import type { Service } from '../../../../shared/components/ServicesList'

interface ConstruccionServicesProps {
  /** Tenant services (already mapped via `toServices`). */
  services: Service[]
}

/**
 * Services section: up to four numbered cards driven by tenant data. Hidden
 * entirely when the tenant has no services.
 *
 * @param props.services - Services to display (first four are shown).
 */
export default function ConstruccionServices({ services }: ConstruccionServicesProps) {
  const { t } = useTranslation()
  const items = services.slice(0, 4)

  if (items.length === 0) return null

  return (
    <section id="servicios" className={styles.section} aria-labelledby="construccion-services-h">
      <div className={styles.head}>
        <div>
          <div className={styles.eyebrow}>{t('construccion.servicesFeatured')}</div>
          <h2 id="construccion-services-h" className={styles.title}>
            {t('construccion.servicesHeading')}
          </h2>
        </div>
      </div>

      <div className={styles.grid}>
        {items.map((svc, i) => (
          <Reveal key={svc.id} delay={i * 80} className={styles.cardReveal}>
            <article className={styles.card}>
              <div className={styles.num}>{String(i + 1).padStart(2, '0')}</div>
              <h3 className={styles.name}>{svc.name}</h3>
              <p className={styles.desc}>{svc.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
