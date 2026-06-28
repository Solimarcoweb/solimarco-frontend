import { useTranslation } from 'react-i18next'
import styles from './ConstruccionProjects.module.css'
import ConstruccionLink from './ConstruccionLink'
import type { ProjectItem } from '../../../../shared/components/ProjectGallery'

interface ConstruccionProjectsProps {
  /** Tenant projects (already mapped via `toProjects`). */
  projects: ProjectItem[]
  /** Max number of projects to show; omit to show all. */
  limit?: number
  /** When set, renders a "see all" link in the section head pointing here. */
  viewAllTo?: string
  /** Whether to render the eyebrow + title head (default true). */
  showHead?: boolean
}

/**
 * Projects mosaic: the first project spans a larger tile, the rest fill the
 * grid. Hidden when the tenant has no projects. Reused by the landing / Inicio
 * (teaser via `limit`) and the multi-page Proyectos page (full, `showHead={false}`).
 *
 * @param props.projects - Projects to display.
 * @param props.limit - Optional cap on the number of tiles.
 * @param props.viewAllTo - Optional "see all" link target.
 * @param props.showHead - Toggle the section head.
 */
export default function ConstruccionProjects({
  projects,
  limit,
  viewAllTo,
  showHead = true,
}: ConstruccionProjectsProps) {
  const { t } = useTranslation()
  const items = limit ? projects.slice(0, limit) : projects

  if (items.length === 0) return null

  return (
    <section id="proyectos" className={styles.section} aria-labelledby="construccion-projects-h">
      {showHead && (
        <div className={styles.head}>
          <div>
            <div className={styles.eyebrow}>{t('construccion.projectsEyebrow')}</div>
            <h2 id="construccion-projects-h" className={styles.title}>
              {t('construccion.projectsHeading')}
            </h2>
          </div>
          {viewAllTo && (
            <ConstruccionLink className={styles.viewAll} to={viewAllTo}>
              {t('construccion.servicesViewAll')} →
            </ConstruccionLink>
          )}
        </div>
      )}

      <div className={styles.mosaic}>
        {items.map((p, i) => (
          <article key={p.id} className={i === 0 ? `${styles.proj} ${styles.big}` : styles.proj}>
            {p.imageUrl && <img src={p.imageUrl} alt="" loading="lazy" decoding="async" />}
            <div className={styles.grad} />
            <div className={styles.cap}>
              {p.category && <div className={styles.tag}>{p.category}</div>}
              <div className={styles.name}>{p.title}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
