import { useTranslation } from 'react-i18next'
import styles from './ConstruccionProjects.module.css'
import type { ProjectItem } from '../../../../shared/components/ProjectGallery'

interface ConstruccionProjectsProps {
  /** Tenant projects (already mapped via `toProjects`). */
  projects: ProjectItem[]
}

/**
 * Projects mosaic for the landing: the first project spans a larger tile, the
 * rest fill the grid. Hidden when the tenant has no projects. Shows up to five
 * as a teaser of the portfolio.
 *
 * @param props.projects - Projects to display.
 */
export default function ConstruccionProjects({ projects }: ConstruccionProjectsProps) {
  const { t } = useTranslation()
  const items = projects.slice(0, 5)

  if (items.length === 0) return null

  return (
    <section id="proyectos" className={styles.section} aria-labelledby="construccion-projects-h">
      <div className={styles.head}>
        <div>
          <div className={styles.eyebrow}>{t('construccion.servicesFeatured')}</div>
          <h2 id="construccion-projects-h" className={styles.title}>
            {t('construccion.projectsHeading')}
          </h2>
        </div>
      </div>

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
