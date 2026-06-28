import { useTranslation } from 'react-i18next'
import styles from './ConstruccionServices.module.css'
import { Reveal } from '../../../../shared/components/Reveal'
import ConstruccionLink from './ConstruccionLink'
import type { Service } from '../../../../shared/components/ServicesList'

interface ConstruccionServicesProps {
  /** Tenant services (already mapped via `toServices`). */
  services: Service[]
  /** Max number of cards to show; omit to show all. */
  limit?: number
  /** When set, renders a "see all" link in the section head pointing here. */
  viewAllTo?: string
  /** Whether to render the eyebrow + title head (default true). */
  showHead?: boolean
}

/**
 * Services section: numbered cards driven by tenant data. Hidden when the tenant
 * has no services. Reused by the landing (summary, `limit`) and the multi-page
 * Servicios page (full list, `showHead={false}`).
 *
 * @param props.services - Services to display.
 * @param props.limit - Optional cap on the number of cards.
 * @param props.viewAllTo - Optional "see all" link target.
 * @param props.showHead - Toggle the section head.
 */
export default function ConstruccionServices({
  services,
  limit,
  viewAllTo,
  showHead = true,
}: ConstruccionServicesProps) {
  const { t } = useTranslation()
  const items = limit ? services.slice(0, limit) : services

  if (items.length === 0) return null

  return (
    <section id="servicios" className={styles.section} aria-labelledby="construccion-services-h">
      {showHead && (
        <div className={styles.head}>
          <div>
            <div className={styles.eyebrow}>{t('construccion.servicesFeatured')}</div>
            <h2 id="construccion-services-h" className={styles.title}>
              {t('construccion.servicesHeading')}
            </h2>
          </div>
          {viewAllTo && (
            <ConstruccionLink className={styles.viewAll} to={viewAllTo}>
              {t('construccion.servicesViewAll')} →
            </ConstruccionLink>
          )}
        </div>
      )}

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
