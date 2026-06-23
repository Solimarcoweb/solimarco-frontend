import styles from './ProjectGallery.module.css'

export interface ProjectItem {
  /** Stable unique id, used as React key. */
  id: string
  /** Project name, rendered as the item heading. */
  title: string
  /** Short description of the work done. */
  description: string
  /** Image URL of the finished project. */
  imageUrl: string
  /** Category label (e.g. "Reforma de baño", "Obra nueva"). */
  category: string
}

export interface ProjectGalleryProps {
  /** Projects to display. Rendered in order as an alternating zig-zag. */
  items: ProjectItem[]
}

/**
 * Project portfolio block for the public per-tenant sites.
 * Renders an asymmetric zig-zag (alternating image/text rows on desktop,
 * stacked single column on mobile) instead of three equal horizontal cards.
 *
 * @param props.items - Projects to display, in order.
 * @returns The gallery section element.
 */
export function ProjectGallery({ items }: ProjectGalleryProps) {
  return (
    <section className={styles.gallery}>
      <ul className={styles.grid}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <figure className={styles.media}>
              <img className={styles.image} src={item.imageUrl} alt={item.title} loading="lazy" />
            </figure>
            <div className={styles.content}>
              <span className={styles.category}>{item.category}</span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
