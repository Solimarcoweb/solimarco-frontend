import { useRef } from 'react'
import styles from './ProjectGallery.module.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

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
  /** Extra class for the root `<section>` (e.g. an alternating background). */
  className?: string
}

/**
 * Project portfolio block for the public per-tenant sites.
 * Renders an asymmetric zig-zag (alternating image/text rows on desktop,
 * stacked single column on mobile) instead of three equal horizontal cards.
 *
 * @param props.items - Projects to display, in order.
 * @returns The gallery section element.
 */
/** Single gallery item that fades up on scroll, staggered by its position. */
function GalleryItem({ item, index }: { item: ProjectItem; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  // Stagger the first three items by 0 / 80 / 160ms; later items reuse 160ms.
  useScrollAnimation(ref, Math.min(index, 2) * 80)

  return (
    <li ref={ref} className={`${styles.item} animate-on-scroll`}>
      <figure className={styles.media}>
        <img className={styles.image} src={item.imageUrl} alt={item.title} loading="lazy" />
      </figure>
      <div className={styles.content}>
        <span className={styles.category}>{item.category}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>
      </div>
    </li>
  )
}

export function ProjectGallery({ items, className }: ProjectGalleryProps) {
  return (
    <section className={className ? `${styles.gallery} ${className}` : styles.gallery}>
      <ul className={styles.grid}>
        {items.map((item, index) => (
          <GalleryItem key={item.id} item={item} index={index} />
        ))}
      </ul>
    </section>
  )
}
